
import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  otp: String,
  otpExpiresAt: Date,
  isPhoneVerified: { type: Boolean, default: false },
  name: String,
  location: String,
  profilePicture: String,
  onboardingComplete: { type: Boolean, default: false },
  username: String,
}, { timestamps: true });

export default mongoose.model("Farmer", farmerSchema);