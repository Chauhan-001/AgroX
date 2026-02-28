import mongoose from "mongoose";


const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  redirectLink: String,

  adType: {
    type: String,
    enum: ["Product", "Service", "Awareness"],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }

}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);
