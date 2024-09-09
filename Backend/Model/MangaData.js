import mongoose from "mongoose";

const MangaSchema = mongoose.Schema({
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
    Chapters: {
        type: Number,
        required: true,
    },
    Rating: {
        type: Number,
        required: true,
        default: 0,
    },
    TotalUsersRead: {
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
    }
});

const Manga = mongoose.model('Manga', MangaSchema);

export default Manga;
