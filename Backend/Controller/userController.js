import User from '../Model/UserModel.js';
import UserData from '../Model/UserData.js'; // Import the UserData model

export const signUp = async (req, res) => {
    try {
        const { Username, Email, Password, ProfilePicture, Gender, Age } = req.body;

        // Check if username already exists
        const existingUsername = await User.findOne({ Username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username Already Exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ Email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        // Use the provided ProfilePicture or a default one
        const profilePictureUrl = ProfilePicture || "https://c4.wallpaperflare.com/wallpaper/164/852/842/jujutsu-kaisen-anime-boys-anime-satoru-gojo-hd-wallpaper-preview.jpg";

        // Create a new user with the full schema
        const createUser = new User({
            Username,
            Email,
            Password,
            ProfilePicture: profilePictureUrl,
            Gender,
            Age,
        });

        await createUser.save();

        // Create a corresponding UserData entry with default values
        const createUserData = new UserData({
            Username,
            AnimeWatched: 0,
            MangaRead: 0,
            TotalEpisodes: 0,
            TotalChapters: 0,
            MeanAnimeScoreGiven: 0.0,
            MeanMangaScoreGiven: 0.0,
        });

        await createUserData.save();

        res.status(201).json({ message: "User Successfully Created" });
    } catch (error) {
        console.error("Error creating user:", error.message);
        if (error.name === "ValidationError") {
            res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const Login = async (req, res) => {
    try {
        const { Username, Password } = req.body;

        // Find user by Username
        const user = await User.findOne({ Username });
        if (user) {
            // Directly compare the password
            if (Password === user.Password) {
                return res.status(200).json({ message: "Login Successful" });
            } else {
                return res.status(400).json({ message: "Incorrect Password" });
            }
        } else {
            return res.status(400).json({ message: "No account with this username" });
        }
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const searchUsersByUsername = async (req, res) => {
    try {
        const { searchString } = req.params;

        if (!searchString) {
            return res.status(400).json({ message: "Search string is required" });
        }

        const regex = new RegExp(searchString, 'i'); 

        const users = await User.find({ Username: { $regex: regex } }).select('-Password');

        if (users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        console.error("Error searching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Userdata = async (req, res) => {
    try {
        const { username } = req.params;  // Changed to `req.params` to get from the route
        
        // Check if Username is provided
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Find the user by Username and exclude the password
        const user = await User.findOne({ Username: username }).select('-Password');
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { username } = req.params; // Extract the username from the URL parameters
        const { ProfilePicture, Gender, Age } = req.body; // Extract the new details from the request body

        // Find the user by Username
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user details only if the values are not empty
        if (ProfilePicture !== undefined && ProfilePicture !== "") {
            user.ProfilePicture = ProfilePicture;
        }
        if (Gender !== undefined && Gender !== "") {
            user.Gender = Gender;
        }
        if (Age !== undefined && Age !== "") {
            user.Age = Age;
        }

        await user.save(); // Save the updated user details to the database

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

