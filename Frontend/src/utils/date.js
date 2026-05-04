export const formatDateISO = (date) => {
    return new Date(date).toISOString().slice(0, 10);
};

export const formatDateDisplay = (date) => {
    return new Date(date).toLocaleDateString();
};