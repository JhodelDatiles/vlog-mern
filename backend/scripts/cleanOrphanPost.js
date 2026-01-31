import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post.js';
import User from '../models/User.js';

dotenv.config();

const cleanOrphanPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const posts = await Post.find();
    let deletedCount = 0;

    for (const post of posts) {
      const authorExists = await User.findById(post.author);
      if (!authorExists) {
        await post.deleteOne();
        deletedCount++;
        console.log(`Deleted orphan post: ${post.title}`);
      }
    }

    console.log(`✅ Cleanup complete. Deleted ${deletedCount} orphan posts.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanOrphanPosts();