import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    Username: {
        type: String,
        unique: true,
        required: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    ProfilePicture: {
        type: String, // Use String to store the URL of the profile picture
        default: "https://c4.wallpaperflare.com/wallpaper/164/852/842/jujutsu-kaisen-anime-boys-anime-satoru-gojo-hd-wallpaper-preview.jpg",
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", "Other"], // Restrict to specific values
        default: "Male",
    },
    Age: {
        type: Number,
        default: 18, // Age should not be negative
    },
    DateJoined: {
        type: Date,
        default: Date.now, // Automatically set the date when the user is created
    }
});

const User = mongoose.model("User", userSchema);

export default User;
