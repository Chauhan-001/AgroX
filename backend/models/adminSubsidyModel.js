import mongoose from "mongoose";

const subsidySchema = new mongoose.Schema({
  title: String,
  description: String,
  schemeType: String, 
  state: String,
  lastDate: String,
  link: String,
  images:[
    {
      type: String,
    },
  ] ,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }
 
}, { timestamps: true });

export default mongoose.model("Subsidy", subsidySchema);

