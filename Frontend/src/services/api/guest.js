import apiInstance from ".";

export const getAllTours = async (params) => {
    return await apiInstance.get("/guest/tours/all", { params });
};

export const getTourById = async (id) => {
    return await apiInstance.get(`/guest/tours/${id}`);
};