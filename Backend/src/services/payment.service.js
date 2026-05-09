import Booking from "../models/booking.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import getPayOSClient from "../config/payos.js";
import { throwError } from "../utils/throwError.js";

const getFrontendUrl = () =>
  process.env.URL_FE || process.env.FRONTEND_APP_URL || "http://localhost:5173";

const generateOrderCode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 900) + 100;
  return Number(`${String(timestamp).slice(-9)}${random}`);
};

const normalizeAmount = (amount) => Math.max(Math.round(Number(amount) || 0), 0);
const PAYMENT_EXPIRES_IN_SECONDS = 5 * 60;

const updateScheduleStatus = async (schedule) => {
  if (!schedule) return;

  if (schedule.currentBooked >= schedule.maxSlots) {
    schedule.status = "FULL";
  } else if (schedule.currentBooked >= Math.ceil(schedule.maxSlots / 2)) {
    schedule.status = "CONFIRMED";
  } else {
    schedule.status = "PENDING";
  }

  await schedule.save();
};

const reserveBookingSlots = async (booking) => {
  if (booking.slotsReserved) {
    return;
  }

  if (booking.isPrivate || !booking.tourScheduleId) {
    booking.slotsReserved = true;
    await booking.save();
    return;
  }

  const totalPeople =
    (Number(booking.quantity?.adults) || 0) +
    (Number(booking.quantity?.children) || 0) +
    (Number(booking.quantity?.infants) || 0);

  if (totalPeople <= 0) {
    return;
  }

  const schedule = await TourSchedule.findOneAndUpdate(
    {
      _id: booking.tourScheduleId,
      $expr: {
        $lte: [{ $add: ["$currentBooked", totalPeople] }, "$maxSlots"],
      },
    },
    { $inc: { currentBooked: totalPeople } },
    { new: true },
  );

  if (!schedule) {
    throwError("Tour schedule not found", 404, "TOUR_SCHEDULE_NOT_FOUND");
  }

  await updateScheduleStatus(schedule);
  booking.slotsReserved = true;
  await booking.save();
};

const releaseBookingSlots = async (booking) => {
  if (!booking.slotsReserved || booking.isPrivate || !booking.tourScheduleId) {
    return;
  }

  const totalPeople =
    (Number(booking.quantity?.adults) || 0) +
    (Number(booking.quantity?.children) || 0) +
    (Number(booking.quantity?.infants) || 0);

  if (totalPeople <= 0) {
    return;
  }

  const schedule = await TourSchedule.findByIdAndUpdate(
    booking.tourScheduleId,
    { $inc: { currentBooked: -totalPeople } },
    { new: true },
  );

  if (!schedule) {
    return;
  }

  if (schedule.currentBooked < 0) {
    schedule.currentBooked = 0;
  }

  await updateScheduleStatus(schedule);
};

const cancelUnpaidBooking = async (booking) => {
  if (booking.payment === "PAID" || booking.status === "CANCELLED") {
    return booking;
  }

  await releaseBookingSlots(booking);
  booking.payment = "UNPAID";
  booking.status = "CANCELLED";
  booking.checkoutUrl = null;
  booking.qrCode = null;
  booking.slotsReserved = false;
  await booking.save();
  return booking;
};

const markBookingPaid = async (booking, paymentLinkId = null) => {
  if (booking.payment === "PAID") {
    return booking;
  }

  await reserveBookingSlots(booking);
  booking.payment = "PAID";
  booking.status = "PAID";
  booking.paidAt = booking.paidAt || new Date();
  booking.trackingCode = paymentLinkId || booking.trackingCode;
  booking.paymentLinkId = paymentLinkId || booking.paymentLinkId;
  await booking.save();
  return booking;
};

export const createBookingPaymentLink = async (bookingId, travelerId = null) => {
  try {
    const payOS = getPayOSClient();
    const booking = await Booking.findById(bookingId).populate(
      "tourId",
      "name location",
    );

    if (!booking) {
      throwError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (travelerId && String(booking.travelerId) !== String(travelerId)) {
      throwError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (booking.status === "CANCELLED") {
      throwError("Booking was cancelled", 400, "BOOKING_CANCELLED");
    }

    if (booking.payment === "PAID") {
      throwError("Booking already paid", 400, "BOOKING_ALREADY_PAID");
    }

    const amount = normalizeAmount(booking.totalAmount);
    if (amount <= 0) {
      throwError("Invalid payment amount", 400, "INVALID_PAYMENT_AMOUNT");
    }

    const orderCode = Number(booking.orderCode) || generateOrderCode();
    const frontendUrl = getFrontendUrl();
    const description = `BOOKING${orderCode}`.slice(0, 25);
    const expiredAt = Math.floor(Date.now() / 1000) + PAYMENT_EXPIRES_IN_SECONDS;

    const paymentLink = await payOS.paymentRequests.create({
      orderCode,
      amount,
      description,
      returnUrl: `${frontendUrl}/traveler/my-booking-traveler?payment=success&bookingId=${booking._id}&orderCode=${orderCode}`,
      cancelUrl: `${frontendUrl}/traveler/my-booking-traveler?payment=cancel&bookingId=${booking._id}&orderCode=${orderCode}`,
      expiredAt,
      items: [
        {
          name: booking.tourId?.name || "Tour booking",
          quantity: 1,
          price: amount,
        },
      ],
    });

    booking.orderCode = String(orderCode);
    booking.trackingCode = paymentLink.paymentLinkId || booking.trackingCode;
    booking.paymentLinkId = paymentLink.paymentLinkId || null;
    booking.checkoutUrl = paymentLink.checkoutUrl || null;
    booking.qrCode = paymentLink.qrCode || null;
    booking.paymentExpiredAt = new Date(expiredAt * 1000);
    await booking.save();

    return {
      booking,
      payment: {
        orderCode,
        amount,
        checkoutUrl: paymentLink.checkoutUrl,
        qrCode: paymentLink.qrCode,
        paymentLinkId: paymentLink.paymentLinkId,
        expiredAt,
      },
    };
  } catch (error) {
    throwError(
      error.message || "Cannot create PayOS payment link",
      error.status || 500,
      error.errorCode || "CREATE_PAYOS_PAYMENT_LINK_ERROR",
    );
  }
};

export const handlePayOSWebhook = async (payload) => {
  try {
    const payOS = getPayOSClient();
    const webhookData = await payOS.webhooks.verify(payload);
    const orderCode = webhookData?.orderCode;

    if (!orderCode) {
      throwError("Invalid PayOS webhook data", 400, "INVALID_PAYOS_WEBHOOK");
    }

    const booking = await Booking.findOne({ orderCode: String(orderCode) });

    if (!booking) {
      throwError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (webhookData.code === "00") {
      await markBookingPaid(booking, webhookData.paymentLinkId);
    } else if (["CANCELLED", "EXPIRED"].includes(webhookData.status)) {
      await cancelUnpaidBooking(booking);
    }

    return booking;
  } catch (error) {
    throwError(
      error.message || "Cannot verify PayOS webhook",
      error.status || 400,
      error.errorCode || "PAYOS_WEBHOOK_ERROR",
    );
  }
};

export const syncPayOSPaymentStatus = async (orderCode, travelerId) => {
  try {
    const payOS = getPayOSClient();
    const booking = await Booking.findOne({
      orderCode: String(orderCode),
      travelerId,
    });

    if (!booking) {
      throwError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (booking.payment === "PAID") {
      return booking;
    }

    const paymentInfo = await payOS.paymentRequests.get(Number(orderCode));

    if (paymentInfo?.status === "PAID") {
      await markBookingPaid(booking);
    } else if (["CANCELLED", "EXPIRED"].includes(paymentInfo?.status)) {
      await cancelUnpaidBooking(booking);
    } else if (
      booking.paymentExpiredAt &&
      new Date(booking.paymentExpiredAt).getTime() <= Date.now()
    ) {
      await cancelUnpaidBooking(booking);
    }

    return booking;
  } catch (error) {
    throwError(
      error.message || "Cannot sync PayOS payment status",
      error.status || 500,
      error.errorCode || "SYNC_PAYOS_PAYMENT_STATUS_ERROR",
    );
  }
};
