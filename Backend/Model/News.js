import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Url: {
        type: String,
        required: true,
    },
    Content: {
        type: String,
        required: true,
    },
})

const News = mongoose.model("News",NewsSchema);

export default News;