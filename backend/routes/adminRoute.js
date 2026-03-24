import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  createSubsidy,
  getAllSubsidies,
  getSubsidyById,
  updateSubsidy,
  deleteSubsidy,
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  toggleNewsStatus,
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  adminLogin
} from "../controllers/adminController.js";
import upload from "../middlewares/cloudinaryStorage.js";
const router = express.Router();
 
router.post("/auth/login", adminLogin);
/* ---------------- POSTS ---------------- */

router.post("/posts", verifyToken,upload.array("images", 4), createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:postId", getPostById);
router.put("/posts/:postId", verifyToken,upload.array("images", 4), updatePost);
router.delete("/posts/:postId", verifyToken, deletePost);


/* ---------------- SUBSIDIES ---------------- */

router.post("/subsidies", verifyToken,upload.array("images", 4), createSubsidy);
router.get("/subsidies", getAllSubsidies);
router.get("/subsidies/:subsidyId", getSubsidyById);
router.put("/subsidies/:subsidyId", verifyToken,upload.array("images", 4), updateSubsidy);
router.delete("/subsidies/:subsidyId", verifyToken, deleteSubsidy);


/* ---------------- NEWS ---------------- */

router.post("/news", verifyToken,upload.array("images", 4), createNews);
router.get("/news", getAllNews);
router.get("/news/:newsId", getNewsById);
router.put("/news/:newsId", verifyToken,upload.array("images", 4), updateNews);
router.delete("/news/:newsId", verifyToken, deleteNews);
router.put("/news/:newsId/toggle", verifyToken, toggleNewsStatus);


export default router;