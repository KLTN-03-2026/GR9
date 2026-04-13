import User from "../models/user.model.js";



const buildGuideError = (message, status = 400, errorCode) => {
    const err = new Error(message);
    err.status = status;
    err.errorCode = errorCode;
    return err;
};

export const createGuide = async (guideData) => {
    try {
        console.log("Creating guide with data:", guideData);
        const existingGuide = await User.findOne({ email: guideData.email });
        if (existingGuide) {
            throw buildGuideError("Email đã tồn tại", 400, "EMAIL_ALREADY_EXISTS");
        }
        const data = await User.create({ ...guideData, role: "GUIDE" });
        return data;
    } catch (error) {
        throw buildGuideError(error.message, error.status, "CREATE_GUIDE_ERROR");
    }
}
