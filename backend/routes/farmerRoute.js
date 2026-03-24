import express from 'express';
import {
  verifyOtp,
  sendOtp,
  createPost,
  toggleLikeComment,
  toggleLikeReply,
  addComment,
  replyToComment,
  getAllPosts,        
  toggleLikePost     
} from '../controllers/farmerController.js';

import { verifyToken } from '../middlewares/verifyToken.js';
import upload from "../middlewares/cloudinaryStorage.js";
import { predictCrop } from "../controllers/modelController.js";
import { getCropDetails } from "../controllers/modelController.js";
import { predictSoil } from "../controllers/soilController.js";


const farmerRoute = express.Router();

/* ================= AUTH ================= */
farmerRoute.post("/auth/send-otp", sendOtp);
farmerRoute.post("/auth/verify-otp", verifyOtp);

/* ================= POSTS ================= */
farmerRoute.post("/create", verifyToken, upload.array("images", 5), createPost);

/* ✅ NEW: GET ALL POSTS */
farmerRoute.get("/posts", verifyToken, getAllPosts);
/* ✅ NEW: LIKE POST */
farmerRoute.put("/:postId/like", verifyToken, toggleLikePost);

/* ================= COMMENTS ================= */
farmerRoute.post("/:postId/comment", verifyToken, addComment);
farmerRoute.put("/:postId/comment/:commentId/like", verifyToken, toggleLikeComment);

/* ================= REPLIES ================= */
farmerRoute.post("/:postId/comment/:commentId/reply", verifyToken, replyToComment);
farmerRoute.put("/:postId/comment/:commentId/reply/:replyId/like", verifyToken, toggleLikeReply);

//models 
farmerRoute.post("/predict-crop", verifyToken, predictCrop);
farmerRoute.post("/crop-detail", verifyToken, getCropDetails);

farmerRoute.post("/predict-soil", verifyToken, predictSoil);

export default farmerRoute;