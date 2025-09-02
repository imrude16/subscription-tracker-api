import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username Is Required"],
        trim: true,
        minlength: [3, "Username Must Be At Least 3 Characters Long"],
        maxlength: [50, "Username Must Be At Most 50 Characters Long"]

    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        trim: true,
        unique: true,
        lowercase: true,
        minlength: [11, "Email Must Be At Least 11 Characters Long"],
        maxlength: [100, "Email Must Be At Most 100 Characters Long"],
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Please Enter A Valid Gmail Address"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password Is Required"],
        minlength: [6, "Password Must Be At Least 6 Characters Long"]
    }
} , { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;