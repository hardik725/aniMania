import mongoose from "mongoose";

const TempUserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  VerificationCode: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 300 seconds = 5 minutes
  },
});

// Create the TempUser model
const TempUser = mongoose.model("TempUser", TempUserSchema);

export default TempUser;
