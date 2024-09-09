import mongoose from "mongoose";

const AnimeSchema = mongoose.Schema({
    Name: {
        type: String,
        unique: true,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Photo: {
        type: String,
        required: true,
    },
    episodes: {
        type: Number,
        required: true,
    },
    Rating: {
        type: Number,
        required: true,
        default: 0,
    },
    TotalUsersWatched: {
        type: Number,
        required: true,
        default: 0,
    },
    Rank: {
        type: Number,
        required: true,
        default: 0,
    },
    aired_on: {
        type: String,
        required: true,
    },
});

const Anime = mongoose.model('Anime', AnimeSchema);

export default Anime;
