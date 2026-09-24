const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


const generateToken = (_id) => {
    return jwt.sign( { _id}, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser  = async (req, res) => {
    const { name, email, password, phone_number, gender, date_of_birth, address } = req.body;
    try {
        const user = await User.signup(name, email, password, phone_number, gender, date_of_birth, address);
        const token = generateToken(user);
        res.status(201).json({ email, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = generateToken(user);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    signupUser,
    loginUser,
};
