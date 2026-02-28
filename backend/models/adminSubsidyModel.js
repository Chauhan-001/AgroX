import mongoose from "mongoose";

const subsidySchema = new mongoose.Schema({
  title: String,
  description: String,
  schemeType: String, 
  state: String,
  lastDate: Date,
  link: String,
  image: String,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }

}, { timestamps: true });

module.exports = mongoose.model("Subsidy", subsidySchema);

