import Post from '../models/Post.js';
import { v2 as cloudinary } from 'cloudinary'; // MAKE SURE THIS IS IMPORTED
import dotenv from 'dotenv'; // Add this if not already in your entry point
dotenv.config();

// 1. CONFIGURE CLOUDINARY AT THE TOP
cloudinary.config({
  cloud_name: process.env.VITE_CLOUD_NAME,
  api_key: process.env.VITE_CLOUD_KEY,
  api_secret: process.env.VITE_CLOUD_SECRET
});

// 🚀 FIXED: Added 'bio' to the populate call
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePic bio') // 👈 BIO ADDED HERE
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, mediaUrl, mediaType, isDownloadable, tags, publicId } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.id,
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "none",
      publicId: publicId || "",
      isDownloadable: isDownloadable ?? true,
      tags: tags || []
    });

    await post.save();
    // 🚀 FIXED: Populate bio here too
    await post.populate('author', 'username email profilePic bio'); 
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, mediaUrl, mediaType, isDownloadable, tags, publicId } = req.body;
    const userId = req.user.id || req.user._id;

    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.author.equals(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.mediaUrl = mediaUrl !== undefined ? mediaUrl : post.mediaUrl;
    post.mediaType = mediaType !== undefined ? mediaType : post.mediaType;
    post.publicId = publicId !== undefined ? publicId : post.publicId;
    post.isDownloadable = isDownloadable !== undefined ? isDownloadable : post.isDownloadable;
    post.tags = tags || post.tags;
    post.updatedAt = Date.now();

    await post.save();
    // 🚀 FIXED: Populate bio here too
    await post.populate('author', 'username email profilePic bio'); 
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email bio profilePic'); 
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Permissions check (Safety first)
    const userId = req.user.id || req.user._id;
    if (!post.author.equals(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    console.log("DEBUG: publicId from DB is:", post.publicId);

    if (post.publicId && post.publicId !== "") {
      const resourceType = post.mediaType === 'video' ? 'video' : 'image';
      
      console.log(`DEBUG: Attempting Cloudinary destroy for ${resourceType}: ${post.publicId}`);

      // CLOUDINARY DELETE CALL
      const result = await cloudinary.uploader.destroy(post.publicId, { 
        resource_type: resourceType 
      });

      console.log("DEBUG: Cloudinary Response:", result); 
    }

    await post.deleteOne();
    res.json({ message: 'Post and media deleted successfully' });

  } catch (error) {
    console.error("DEBUG: Delete Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like/Unlike post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};