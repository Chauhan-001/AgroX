import Post from "../models/adminMarketplacepostModel.js";
import jwt from "jsonwebtoken";
import News from "../models/adminNewsModel.js";
import Subsidy from "../models/adminSubsidyModel.js";
import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";



//admin login
export const adminLogin = async (req, res) => {
  try {

    const { id, password } = req.body;

    // Find admin by ID
    const admin = await Admin.findOne({ id });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      adminId: admin._id,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE POST
export const createPost = async (req, res) => {
  try {

    const { title, product, image, company, description, price, contactInfo } = req.body;

    const post = new Post({
      title,
      product,
      image,
      company,
      description,
      price,
      contactInfo,
      postedBy: req.user.id
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {

    const posts = await Post.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {

    const post = await Post.findById(req.params.postId)
      .populate("postedBy", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE POST
export const updatePost = async (req, res) => {
  try {

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      message: "Post updated successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE POST
export const deletePost = async (req, res) => {
  try {

    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// CREATE NEWS
export const createNews = async (req, res) => {
  try {

    const { title, description, image, redirectLink, adType } = req.body;

    const news = new News({
      title,
      description,
      image,
      redirectLink,
      adType,
      postedBy: req.user.id
    });

    await news.save();

    res.status(201).json({
      message: "News created successfully",
      news
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL ACTIVE NEWS
export const getAllNews = async (req, res) => {
  try {

    const news = await News.find({ isActive: true })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(news);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET SINGLE NEWS
export const getNewsById = async (req, res) => {
  try {

    const news = await News.findById(req.params.newsId)
      .populate("postedBy", "name email");

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE NEWS
export const updateNews = async (req, res) => {
  try {

    const news = await News.findByIdAndUpdate(
      req.params.newsId,
      req.body,
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({
      message: "News updated successfully",
      news
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE NEWS
export const deleteNews = async (req, res) => {
  try {

    const news = await News.findByIdAndDelete(req.params.newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({
      message: "News deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// TOGGLE ACTIVE / INACTIVE
export const toggleNewsStatus = async (req, res) => {
  try {

    const news = await News.findById(req.params.newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    news.isActive = !news.isActive;

    await news.save();

    res.json({
      message: "News status updated",
      news
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};













// CREATE SUBSIDY
export const createSubsidy = async (req, res) => {
  try {

    const { title, description, schemeType, state, lastDate, link, image } = req.body;

    const subsidy = new Subsidy({
      title,
      description,
      schemeType,
      state,
      lastDate,
      link,
      image,
      postedBy: req.user.id
    });

    await subsidy.save();

    res.status(201).json({
      message: "Subsidy created successfully",
      subsidy
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL SUBSIDIES
export const getAllSubsidies = async (req, res) => {
  try {

    const subsidies = await Subsidy.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(subsidies);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET SINGLE SUBSIDY
export const getSubsidyById = async (req, res) => {
  try {

    const subsidy = await Subsidy.findById(req.params.subsidyId)
      .populate("postedBy", "name email");

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy not found" });
    }

    res.json(subsidy);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE SUBSIDY
export const updateSubsidy = async (req, res) => {
  try {

    const subsidy = await Subsidy.findByIdAndUpdate(
      req.params.subsidyId,
      req.body,
      { new: true }
    );

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy not found" });
    }

    res.json({
      message: "Subsidy updated successfully",
      subsidy
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE SUBSIDY
export const deleteSubsidy = async (req, res) => {
  try {

    const subsidy = await Subsidy.findByIdAndDelete(req.params.subsidyId);

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy not found" });
    }

    res.json({
      message: "Subsidy deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};