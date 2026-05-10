import apiInstance from ".";

export const getAllTours = async (params) => {
    return await apiInstance.get("/guest/tours/all", { params });
};

export const getTourById = async (id) => {
    return await apiInstance.get(`/guest/tours/${id}`);
};

export const getGuestTracking = async (trackingCode) => {
    return await apiInstance.get("/guest/tracking", {
        params: { trackingCode },
    });
};

export const getGuestBookingSuccess = async ({ orderCode, trackingCode }) => {
    return await apiInstance.get("/guest/booking-success", {
        params: { orderCode, trackingCode },
    });
};
