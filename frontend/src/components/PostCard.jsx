import { Heart, Edit3, Trash2, Download, PlayCircle } from "lucide-react";
import { handleForceDownload } from "../utils/cloudinary.js";
import { Link } from "react-router-dom"; // 👈 Integrated

const PostCard = ({ post, onRead, currentUser, onLike, onEdit, onDelete, isDashboard }) => {
  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = post.likes?.includes(currentUserId);
  const showManagement = isDashboard === true;

  // 🚀 TITLE LOGIC
  const TITLE_LIMIT = 28; 
  const isLongTitle = post.title?.length > TITLE_LIMIT;
  const displayTitle = isLongTitle 
    ? post.title.substring(0, TITLE_LIMIT) + "..." 
    : post.title;

  // 🚀 CONTENT LOGIC
  const CHAR_LIMIT = 150; 
  const isLongContent = post.content?.length > CHAR_LIMIT;
  const displayContent = isLongContent 
    ? post.content.substring(0, CHAR_LIMIT) + "..." 
    : post.content;

  return (
    <div 
      onClick={onRead}
      className="card bg-base-200 shadow-xl border border-base-300 hover:border-primary/40 transition-all cursor-pointer h-auto group overflow-hidden"
    >
      <div className="card-body p-5 flex flex-col gap-3">
        {/* Header Section */}
        <div className="w-full mb-1">
          <h2 
            className="card-title text-xl font-black text-base-content leading-tight break-words" 
            title={post.title}
          >
            {displayTitle}
          </h2>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="avatar">
              <div className="w-5 h-5 rounded-full ring ring-primary/20 ring-offset-base-100 ring-offset-1">
                {post.author?.profilePic ? (
                  <img src={post.author.profilePic} alt={post.author.username} />
                ) : (
                  <div className="bg-neutral text-neutral-content flex items-center justify-center text-[8px] font-bold uppercase w-full h-full">
                    {post.author?.username?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest opacity-60 font-bold">
              {/* 🚀 NEW: Clickable Username Link */}
              <Link 
                to={`/profile/${post.author?.username}`}
                onClick={(e) => e.stopPropagation()} 
                className="truncate max-w-[80px] hover:text-primary transition-colors cursor-pointer"
              >
                {post.author?.username}
              </Link> 
              <span className="flex-shrink-0">• {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full">
          <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {displayContent}
            {isLongContent && (
              <span className="text-primary font-bold ml-1 hover:underline">see more</span>
            )}
          </p>
        </div>

        {/* Media Section */}
        {post.mediaUrl && (
          <div className="overflow-hidden rounded-xl border border-base-300 relative bg-base-300 w-full mt-2">
            {post.mediaType === "video" ? (
              <div className="flex items-center justify-center aspect-video relative">
                <video src={post.mediaUrl} className="w-full h-full object-cover opacity-80" />
                <PlayCircle className="absolute w-12 h-12 text-white/80" />
              </div>
            ) : (
              <img 
                src={post.mediaUrl} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={post.title} 
              />
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="card-actions justify-between items-center mt-2 pt-3 border-t border-base-content/10">
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(); }} 
            className="flex items-center gap-2 hover:scale-110 transition-transform active:scale-90"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-error text-error" : "opacity-50"}`} />
            <span className="text-sm font-bold">{post.likes?.length || 0}</span>
          </button>

          <div className="flex gap-1">
            {showManagement ? (
              <>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="btn btn-ghost btn-xs text-info hover:bg-info/10">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(post._id); }} className="btn btn-ghost btn-xs text-error hover:bg-error/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              post.isDownloadable && post.mediaUrl && (
                <button onClick={(e) => { e.stopPropagation(); handleForceDownload(post.mediaUrl, post.title); }} className="btn btn-ghost btn-xs text-primary">
                  <Download className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;