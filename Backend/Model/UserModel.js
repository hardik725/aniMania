import mongoose from "mongoose";

const UserDataSchema = mongoose.Schema({
    // Common fields
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
        type: String,
        default: "https://c4.wallpaperflare.com/wallpaper/164/852/842/jujutsu-kaisen-anime-boys-anime-satoru-gojo-hd-wallpaper-preview.jpg",
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Male",
    },
    Age: {
        type: Number,
        default: 18,
    },
    DateJoined: {
        type: Date,
        default: Date.now,
    },

    // Anime and Manga statistics
    AnimeWatched: {
        type: Number,
        required: true,
    },
    MangaRead: {
        type: Number,
        required: true,
    },
    TotalEpisodes: {
        type: Number,
        required: true,
    },
    TotalChapters: {
        type: Number,
        required: true,
    },
    MeanAnimeScoreGiven: {
        type: Number,
        required: true,
    },
    MeanMangaScoreGiven: {
        type: Number,
        required: true,
    },

    // Lists and Friends
    AnimeList: [
        {
            title: { type: String, required: true },
            score: { type: Number, required: true },
        }
    ],
    MangaList: [
        {
            title: { type: String, required: true },
            score: { type: Number, required: true },
        }
    ],
    UserFriend: [
        {
            FriendName: { type: String, required: true },
        }
    ],

    // Messages
    Messages: [
        {
            friend: { type: String, required: true },
            conversation: [
                {
                    sender: { type: String, required: true },
                    content: { type: String, required: true },
                    timestamp: { type: Date, default: Date.now },
                }
            ]
        }
    ],

    // Notifications
    Notifications: [
        {
            message: { type: String, required: true },
            type: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
            timestamp: { type: Date, default: Date.now },
        }
    ],
    AnimeGenresWatched: {
        type: Map,
        of: Number,
        default: {
            Action: 0,
            Comedy: 0,
            Drama: 0,
            Fantasy: 0,
            Romance: 0,
        },
    },
});

const User = mongoose.model("MergedUser", UserDataSchema);

export default User;
