const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  product: String,
  image: String,
  comapny: String,
  description: String,
  price:string,
  contactInfo: String,
   postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);