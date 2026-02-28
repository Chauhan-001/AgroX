import mongoose from "mongoose";

const farmerPostSchema = new mongoose.Schema({

  caption: {
    type: String,
  },

  mediaUrl: {
    type: String,
    required: true,
  },

  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },

  location: {
    type: String,
  },

  cropType: {
    type: String,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer"
  }],

  comments: [{
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer"
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]

}, { timestamps: true });

module.exports = mongoose.model("FarmerPost", farmerPostSchema);
