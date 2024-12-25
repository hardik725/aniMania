import mongoose from "mongoose";

const TemporaryUserSchema = mongoose.Schema({
  Username: { type: String, unique: true, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  VerificationCode: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now, expires: '1h' } // Auto-delete after 1 hour
});

const TemporaryUser = mongoose.model('TemporaryUser', TemporaryUserSchema);
export default TemporaryUser;
