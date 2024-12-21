import mongoose from "mongoose";

const GenreSchema = mongoose.Schema({
    genre: {type: String , required:true},
    Names: [
        {
            title: {type: String , required: true},
        }
    ],
})

const GenreData = mongoose.model("GenreData",GenreSchema);
export default GenreData;