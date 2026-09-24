const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name: {type: String,required: true},
        email: {type: String,required: true, unique: true},
        password: {type: String,required: true},
        phone_number: {type: String,required: true},
        gender: {type: String,required: true},
        date_of_birth: {type: Date,required: true},
        address: {
            street: {type: String,required: true},
            city: {type: String,required: true},
            zipCode: {type: String,required: true},
        },
    },
    {timestamps: true, versionKey: false }
);

userSchema.statics.signup = async function (
    name,
    email,
    password,
    phone_number,
    gender,
    date_of_birth,
    address
) {
    if (!name || !email || !password || !phone_number || !gender || !date_of_birth || !address) {
        throw new Error("Missing required fields");
    }
     if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Invalid password");
    }
    const userExists = await this.findOne({email});
    if (userExists) {
        throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({
        name,
        email,
        password: hashedPassword,
        phone_number,
        gender,
        date_of_birth,
        address,
    });
    return user;
};
 
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if (!user) {
        throw new Error("User not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Incorrect password");
    }
    return user;
};
    
module.exports = mongoose.model("User", userSchema);