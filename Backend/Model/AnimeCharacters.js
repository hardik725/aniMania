import mongoose from "mongoose";

const CharSchema = mongoose.Schema({
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


const CharData = mongoose.model("CharData", CharSchema);
export default CharData;
