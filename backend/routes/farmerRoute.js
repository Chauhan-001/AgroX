import express from 'express';
import {verifyOtp, sendOtp,createPost,toggleLikeComment,toggleLikeReply,addComment,replyToComment} from '../controllers/farmerController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const farmerRoute = express.Router();

farmerRoute.post("/auth/send-otp", sendOtp);

farmerRoute.post("/auth/verify-otp", verifyOtp);
// Create post
farmerRoute.post("/create", verifyToken, createPost);

// Add comment to post
farmerRoute.post("/:postId/comment", verifyToken, addComment);

// Like or unlike a comment
farmerRoute.put("/:postId/comment/:commentId/like", verifyToken, toggleLikeComment);

// Reply to comment
farmerRoute.post("/:postId/comment/:commentId/reply", verifyToken, replyToComment);

// Like or unlike reply
farmerRoute.put("/:postId/comment/:commentId/reply/:replyId/like", verifyToken, toggleLikeReply);

export default farmerRoute;