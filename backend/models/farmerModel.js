
import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  otp: String,
  otpExpiresAt: Date,
  isPhoneVerified: { type: Boolean, default: false },
  name: String,
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Farmer", farmerSchema);