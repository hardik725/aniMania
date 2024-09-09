import mongoose from "mongoose";

const CharacSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
    },
    Characters: [{
        name: { type: String, required: true },
        role: { type: String, required: true},
        image: { type: String, required: true },
    }]
});


const CharacData = mongoose.model("CharacData", CharacSchema);
export default CharacData;
