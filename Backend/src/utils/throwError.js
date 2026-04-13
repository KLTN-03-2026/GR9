export const throwError = (message, status, errorCode) => {
    const error = new Error(message);
    error.status = status;
    error.errorCode = errorCode;
    throw error;
};