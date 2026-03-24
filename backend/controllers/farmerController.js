import Farmer from "../models/farmerModel.js";
import farmerPostModel from "../models/farmerPostModel.js";
import FarmerPost from "../models/farmerPostModel.js";
import jwt from "jsonwebtoken";

const OTP_EXP_MIN = 5;

function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function sendOtp(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone required" });
    }

    let user = await Farmer.findOne({ phone });
    if (!user) user = await Farmer.create({ phone });

    user.otp = generateOtp();
    user.otpExpiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);
    await user.save();

    console.log("OTP (DEV):", user.otp);

    res.json({ success: true, message: "OTP sent" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;
    const user = await Farmer.findOne({ phone });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    user.isPhoneVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        onboardingComplete: user.onboardingComplete,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}


export const createPost = async (req, res) => {
  try {

    const { caption,  location } = req.body;

    
    const mediaUrl= req.files ? req.files.map(file => file.path) : [];

    
    const post = new FarmerPost({
      caption,
      location,
      postedBy: req.user.id,
      mediaUrl
    });

    await post.save();

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLikeComment = async (req, res) => {
  try {

    const post = await FarmerPost.findById(req.params.postId);

    const comment = post.comments.id(req.params.commentId);

    const userId = req.user.id;

    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {

    const post = await farmerPostModel.findById(req.params.postId);

    post.comments.push({
      farmerId: req.user.id,
      text: req.body.text
    });

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {

    const post = await farmerPostModel.findById(req.params.postId);

    const comment = post.comments.id(req.params.commentId);

    comment.replies.push({
      farmerId: req.user.id,
      text: req.body.text
    });

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLikeReply = async (req, res) => {
  try {

    const post = await farmerPostModel.findById(req.params.postId);

    const comment = post.comments.id(req.params.commentId);

    const reply = comment.replies.id(req.params.replyId);

    const userId = req.user.id;

    if (reply.likes.includes(userId)) {
      reply.likes.pull(userId);
    } else {
      reply.likes.push(userId);
    }

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await farmerPostModel.find()
      .populate("postedBy", "name ")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await farmerPostModel.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

