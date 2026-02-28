import mongoose from "mongoose";




const adminSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  password: String,
 
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
