import { useState, useEffect } from "react";
import { postAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import PostView from "../components/PostView";
import EditUserModal from "./EditUserModal";
import { PlusCircle, Loader2, X, Settings } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id || user?._id) fetchMyPosts();
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      const myPosts = response.data.filter(
        (p) => p.author && String(p.author._id) === String(user.id || user._id),
      );
      setPosts(myPosts);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      await postAPI.likePost(postId);
      fetchMyPosts();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingPost) {
        await postAPI.updatePost(editingPost._id, formData);
        toast.success("Post updated!");
      } else {
        await postAPI.createPost(formData);
        toast.success("Art created!");
      }
      fetchMyPosts();
      closeAllModals();
    } catch (error) {
      toast.error("Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this masterpiece?"))
      return;
    try {
      await postAPI.deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
      toast.success("Post removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const closeAllModals = () => {
    setIsFormOpen(false);
    setIsEditModalOpen(false);
    setEditingPost(null);
    setViewingPost(null);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10]">
        <Loader2 className="animate-spin text-primary w-10 h-10 md:w-12 md:h-12" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl min-h-screen">
      {/* 📱 RESPONSIVE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
            Posts
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            Manage your creative collection
          </p>
        </div>

        {/* Buttons expand to full width on mobile */}
        <div className="flex w-full sm:w-auto gap-2 md:gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-outline border-base-300 hover:bg-base-300 text-base-content gap-2 flex-1 sm:flex-none"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs md:text-sm uppercase font-bold">
              Settings
            </span>
          </button>

          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary shadow-lg shadow-primary/20 gap-2 flex-1 sm:flex-none h-12 md:h-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-xs md:text-sm uppercase font-bold tracking-wider">
              New Post
            </span>
          </button>
        </div>
      </div>

      {/* 📱 FLEXIBLE MASONRY GRID */}
      {posts.length === 0 ? (
        <div className="text-center py-16 md:py-24 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
          <p className="text-gray-500 px-4">
            Your studio is currently empty. Start creating!
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="break-inside-avoid">
              <PostCard
                post={post}
                currentUser={user}
                isDashboard={true}
                onLike={() => handleLikeToggle(post._id)}
                onEdit={() => {
                  setEditingPost(post);
                  setIsFormOpen(true);
                }}
                onDelete={() => handleDelete(post._id)}
                onRead={() => setViewingPost(post)}
              />
            </div>
          ))}
        </div>
      )}

      {/* --- RESPONSIVE MODALS --- */}

      {/* Settings Modal (Already optimized in EditUserModal) */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* 📱 VIEW POST MODAL - Mobile Optimized Overlay */}
      {viewingPost && (
        <div className="modal modal-open items-end sm:items-center">
          <div className="modal-box max-w-3xl w-full p-0 bg-[#12141a] border-t sm:border border-white/10 relative rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingPost(null)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-[60] text-white bg-black/20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 md:p-10">
              <PostView
                post={viewingPost}
                currentUser={user}
                onLike={() => handleLikeToggle(viewingPost._id)}
              />
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/90 backdrop-blur-md"
            onClick={() => setViewingPost(null)}
          ></div>
        </div>
      )}

      {/* 📱 POST FORM MODAL - Mobile Keyboard Friendly */}
      {isFormOpen && (
        <div className="modal modal-open items-center px-2">
          <div className="modal-box w-full max-w-2xl bg-[#12141a] border border-white/10 relative p-6 md:p-8 rounded-2xl">
            <button
              onClick={closeAllModals}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white/50"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-xl md:text-2xl mb-6 text-white italic uppercase">
              {editingPost ? "Edit Masterpiece" : "Create New Art"}
            </h3>
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <PostForm
                initialData={editingPost}
                onSubmit={handleFormSubmit}
                isLoading={submitting}
              />
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/80 backdrop-blur-sm"
            onClick={closeAllModals}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
