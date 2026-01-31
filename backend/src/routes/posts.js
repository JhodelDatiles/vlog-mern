import express from 'express';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost
} from '../controllers/postController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', getAllPosts);

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', getPost);

// @route   POST /api/posts
// @desc    Create post
// @access  Private
router.post('/', auth, createPost);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', auth, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, deletePost);

// @route   PUT /api/posts/:id/like
// @desc    Like/Unlike post
// @access  Private
router.put('/:id/like', auth, likePost);

export default router;