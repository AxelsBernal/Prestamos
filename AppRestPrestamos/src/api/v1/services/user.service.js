import User from "../models/User.js";

const register = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

const findByEmail = async (email) => {
    return await User.findOne({ email });
};

const findById = async (id) => {
    return await User.findById(id);
};

export default {
    register,
    findByEmail,
    findById,
};
