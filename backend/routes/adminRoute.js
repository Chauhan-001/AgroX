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

const router = express.Router();

router.post("/auth/login", adminLogin);
/* ---------------- POSTS ---------------- */

router.post("/posts", verifyToken, createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:postId", getPostById);
router.put("/posts/:postId", verifyToken, updatePost);
router.delete("/posts/:postId", verifyToken, deletePost);


/* ---------------- SUBSIDIES ---------------- */

router.post("/subsidies", verifyToken, createSubsidy);
router.get("/subsidies", getAllSubsidies);
router.get("/subsidies/:subsidyId", getSubsidyById);
router.put("/subsidies/:subsidyId", verifyToken, updateSubsidy);
router.delete("/subsidies/:subsidyId", verifyToken, deleteSubsidy);


/* ---------------- NEWS ---------------- */

router.post("/news", verifyToken, createNews);
router.get("/news", getAllNews);
router.get("/news/:newsId", getNewsById);
router.put("/news/:newsId", verifyToken, updateNews);
router.delete("/news/:newsId", verifyToken, deleteNews);
router.put("/news/:newsId/toggle", verifyToken, toggleNewsStatus);


export default router;