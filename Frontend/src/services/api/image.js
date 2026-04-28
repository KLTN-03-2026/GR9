// src/api/image.api.js

import apiInstance from ".";

export const uploadImagesApi = (files, entityType, entityId) => {
    const formData = new FormData();

    for (let file of files) {
        formData.append("images", file);
    }
    formData.append("entityType", entityType);
    formData.append("entityId", entityId);
    return apiInstance.post("/images", formData);
};

export const syncTourImagesApi = (entityId, entityType, images) => {
    return apiInstance.put("/images/sync", {
        entityId,
        entityType,
        images,
    });
};
