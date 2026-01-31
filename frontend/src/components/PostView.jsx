import { Download, X, Globe, Heart, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // 👈 Integrated
import { handleForceDownload } from "../utils/cloudinary.js";

const PostView = ({ post, isOwner, onEdit, onDelete, currentUser, onLike }) => {
  const [isFullImage, setIsFullImage] = useState(false);
  const isLiked = post.likes?.includes(currentUser?.id || currentUser?._id);

  if (!post) return null;

  return (
    <div className="flex flex-col w-full text-base-content">
      {/* 1. Header & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar">
            <div className="bg-primary text-primary-content rounded-full w-12 h-12 ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              {post.author?.profilePic ? (
                <img src={post.author.profilePic} alt={post.author.username} className="object-cover" />
              ) : (
                <span className="text-xl font-bold flex items-center justify-center h-full">
                  {post.author?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div>
            {/* 🚀 NEW: Clickable Username Link */}
            <Link 
              to={`/profile/${post.author?.username}`}
              className="font-black text-lg hover:text-primary transition-colors cursor-pointer block"
            >
              {post.author?.username}
            </Link>
            <p className="text-[10px] opacity-50 uppercase flex items-center gap-1 font-bold tracking-tighter">
              <Globe className="w-3 h-3"/> {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <h2 className="text-4xl font-black leading-tight break-words tracking-tighter">{post.title}</h2>
      </div>

      {/* 2. Content Body */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90 break-words font-serif">
          {post.content}
        </p>
      </div>

      {/* 3. Media Display */}
      {post.mediaUrl && (
        <div className="w-full mb-8 rounded-2xl bg-base-300 overflow-hidden border border-base-content/10 flex items-center justify-center shadow-inner">
          {post.mediaType === "video" ? (
            <video key={post.mediaUrl} className="w-full max-h-[70vh] object-contain" controls>
              <source src={post.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={post.mediaUrl} 
              className="w-full h-auto object-contain cursor-zoom-in hover:opacity-95 transition-opacity" 
              onClick={() => setIsFullImage(true)} 
              alt={post.title} 
            />
          )}
        </div>
      )}

      {/* 4. Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-base-content/10 py-4 mb-6 bg-base-200/50 px-6 rounded-2xl">
        <button 
          onClick={onLike} 
          className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-base-300 transition-all active:scale-95 ${isLiked ? "text-error" : "text-base-content/60"}`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          <span className="font-black text-sm">{post.likes?.length || 0} Likes</span>
        </button>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <button onClick={onEdit} className="btn btn-info btn-sm gap-2 normal-case font-bold rounded-lg shadow-md">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => onDelete(post._id)} className="btn btn-error btn-sm gap-2 normal-case font-bold rounded-lg shadow-md">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          ) : (
            post.mediaUrl && post.isDownloadable && (
              <button 
                onClick={() => handleForceDownload(post.mediaUrl, post.title)} 
                className="btn btn-primary btn-sm gap-2 normal-case font-bold shadow-lg rounded-lg"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            )
          )}
        </div>
      </div>

      {/* Image Zoom */}
      {isFullImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsFullImage(false)}>
          <button className="absolute top-8 right-8 btn btn-circle btn-ghost text-white border-white/20"><X /></button>
          <img src={post.mediaUrl} className="max-w-full max-h-full object-contain shadow-2xl" alt="" />
        </div>
      )}
    </div>
  );
};

export default PostView;