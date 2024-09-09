import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    ReviewList: [{
        user: { type: String, required: true },
        animeName: { type: String, required: true },
        review: { type: String, required: true } // Changed from Number to String
    }]
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
