import nodemailer from 'nodemailer';
import crypto from 'crypto';
import TemporaryUser from '../Model/TemporaryUser.js';
import User from '../Model/UserModel.js';

export const signUpUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Generate a verification code
        const verificationCode = crypto.randomBytes(16).toString('hex');

        // Save temporary user
        const tempUser = new TemporaryUser({
            username,
            email,
            password,
            verificationCode,
        });

        await tempUser.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'animania714@gmail.com',
                pass: 'AniMania@071423',
            },
        });

        const mailOptions = {
            from: 'animania714@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification email sent!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Failed to sign up. Please try again.' });
    }
};

export const verifyUser = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        // Check if the temporary user exists
        const tempUser = await TemporaryUser.findOne({ email, verificationCode });

        if (!tempUser) {
            return res.status(400).json({ message: 'Invalid verification code or email.' });
        }
        const existingUsername = await User.findOne({ Username : tempUser.username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username Already Exists" });
        }
        // Use the provided ProfilePicture or a default one
        const profilePictureUrl = "https://c4.wallpaperflare.com/wallpaper/164/852/842/jujutsu-kaisen-anime-boys-anime-satoru-gojo-hd-wallpaper-preview.jpg";
       
        // Move the user to the permanent user collection
        const createUser = new User({
            Username : tempUser.username,
            Email : tempUser.email,
            Password : tempUser.password,
            ProfilePicture: profilePictureUrl,
            Gender,
            Age,
            AnimeWatched: 0,
            MangaRead: 0,
            TotalEpisodes: 0,
            TotalChapters: 0,
            MeanAnimeScoreGiven: 0.0,
            MeanMangaScoreGiven: 0.0,
        });

        await createUser.save();
        await TemporaryUser.deleteOne({ email });

        res.status(200).json({ message: 'User verified and created successfully!' });
    } catch (error) {
        console.error('Error during verification:', error);
        res.status(500).json({ message: 'Verification failed. Please try again.' });
    }
};
