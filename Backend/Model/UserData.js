import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    Username: {
        type: String,
        unique: true,
        required: true,
    },
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
    AnimeList: [{
        title: { type: String, required: true },
        score: { type: Number, required: true }
    }],
    MangaList: [{
        title: { type: String, required: true },
        score: { type: Number, required: true }
    }],
    UserFriend: [{
        FriendName: { type: String, required: true }
    }],
    Messages: [{
        friend: { type: String, required: true }, // Friend's name (recipient or sender)
        conversation: [{
            sender: { type: String, required: true }, // Username of the sender
            content: { type: String, required: true }, // Message content
            timestamp: { type: Date, default: Date.now } // Timestamp of the message
        }]
    }],
    // Array to store notifications
    Notifications: [{
        message: { type: String, required: true }, // The notification message
        type: { type: String, enum: ['info', 'warning', 'error'], default: 'info' }, // Type of notification
        timestamp: { type: Date, default: Date.now } // Timestamp of the notification
    }]
});

const UserData = mongoose.model("UserData", DataSchema);
export default UserData;
