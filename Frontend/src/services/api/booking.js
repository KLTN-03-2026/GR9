import apiInstance from ".";

export const createBooking = (payload) => {
    return apiInstance.post("/booking", payload);
};

export const getMyBookings = () => {
    return apiInstance.get("/booking/me");
};

export const getBookingById = (id) => {
    return apiInstance.get(`/booking/${id}`);
};

export const cancelBooking = (id) => {
    return apiInstance.put(`/booking/${id}/cancel`);
};

export const updateBooking = (id, payload) => {
    return apiInstance.put(`/booking/${id}`, payload);
};
