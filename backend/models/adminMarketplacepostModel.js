import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  product: String,
  image: String,
  company: String,
  description: String,
  price: String,
  contactInfo: String,
  postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }

}, { timestamps: true });

export default mongoose.model("Post", postSchema);