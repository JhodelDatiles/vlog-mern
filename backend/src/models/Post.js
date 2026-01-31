import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaUrl: { type: String, default: "" },
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  publicId: String, // ADD THIS LINE
  isDownloadable: { type: Boolean, default: true },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Post', PostSchema);