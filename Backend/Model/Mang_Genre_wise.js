import mongoose from "mongoose";

const MangGenreSchema = mongoose.Schema({
    genre: {type: String , required:true},
    Names: [
        {
            title: {type: String , required: true},
        }
    ],
})

const MangGenreData = mongoose.model("MangGenreData",MangGenreSchema);
export default MangGenreData;