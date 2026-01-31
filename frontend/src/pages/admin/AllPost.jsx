import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🚀 Added useNavigate
import { postAPI } from "../../utils/api";
import { FileText, Trash2, Eye, Loader2, ArrowLeft } from "lucide-react"; // 🚀 Added ArrowLeft icon
import toast from "react-hot-toast";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 🚀 Initialize navigate

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await postAPI.deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🚀 Updated Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-circle btn-ghost border border-white/10 hover:bg-white/10"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">All Posts</h1>
            <p className="text-sm text-base-content/60 tracking-wide">Admin Management Portal</p>
          </div>
        </div>
        <div className="badge badge-primary badge-outline p-4 font-bold h-10">
          Total: {posts.length} Posts
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border border-dashed border-white/10">
          <FileText className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
          <p className="text-xl text-base-content/50 font-medium">No posts found in database</p>
        </div>
      ) : (
        <div className="card bg-[#12141a] shadow-2xl border border-white/5 overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-white/5">
                <tr className="text-white/70 uppercase text-xs tracking-widest border-b border-white/10">
                  <th className="py-5">Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th className="text-center">Stats</th>
                  <th>Date Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-sm">
                {posts.map((post) => {
                  const TITLE_LIMIT = 15;
                  const displayTitle = post.title?.length > TITLE_LIMIT 
                    ? post.title.substring(0, TITLE_LIMIT) + ".." 
                    : post.title;

                  return (
                    <tr key={post._id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                      <td>
                        <Link
                          to={`/posts/${post._id}`}
                          className="font-bold text-primary hover:underline"
                          title={post.title}
                        >
                          {displayTitle}
                        </Link>
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-9 h-9 bg-neutral ring-1 ring-white/10">
                              {post.author?.profilePic ? (
                                <img src={post.author.profilePic} alt={post.author.username} />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-[10px] font-black uppercase text-white/40">
                                  {post.author?.username?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-medium text-white/80">
                            {post.author?.username || "Unknown"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-sm badge-ghost opacity-70">
                          {post.category || "Uncategorized"}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="flex justify-center gap-4 text-xs font-mono opacity-60">
                          <span title="Likes">❤️ {post.likes?.length || 0}</span>
                          <span title="Comments">💬 {post.comments?.length || 0}</span>
                        </div>
                      </td>

                      <td className="opacity-60">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/posts/${post._id}`}
                            className="btn btn-ghost btn-sm text-info p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="btn btn-ghost btn-sm text-error p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;