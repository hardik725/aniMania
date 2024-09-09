import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    ReviewList: [{
        user: { type: String, required: true },
        mangaName: { type: String, required: true },
        review: { type: String, required: true } // Changed from Number to String
    }]
});

const MangaReview = mongoose.model('MangaReview', ReviewSchema);

export default MangaReview;
