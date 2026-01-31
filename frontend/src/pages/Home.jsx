import { useState, useEffect } from "react";
import { postAPI } from "../utils/api";
import PostCard from "../components/PostCard";
import PostView from "../components/PostView";
import { Loader2, X, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingPost, setViewingPost] = useState(null);
  const { user } = useAuth(); // Get user state from context

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data.filter((post) => post.author));
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId) => {
    // 🔒 AUTH CHECK: If no user is logged in, show toast and stop
    if (!user) {
      return toast.error("Please login first to like posts", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }

    try {
      const response = await postAPI.likePost(postId);
      const updatedPost = response.data;
      setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
      if (viewingPost?._id === postId) setViewingPost(updatedPost);
    } catch (error) {
      toast.error("Error updating like");
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      {/* Header with Logo/Title & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div className="flex items-center gap-3">
          <img src="/ipaskil_logo.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <h1 className="text-3xl md:text-4xl font-black text-base-content italic tracking-tighter uppercase">
            RAW • REAL • RELEASES
          </h1>
        </div>

        {/* Theme-aware Search Bar */}
        <div className="relative w-full sm:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search titles or artists..."
            className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
      ) : (
        /* Responsive Masonry Grid */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="break-inside-avoid">
              <PostCard 
                post={post} 
                currentUser={user}
                onLike={() => handleLikeToggle(post._id)}
                onRead={() => setViewingPost(post)} 
                isDashboard={false} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Section */}
      {viewingPost && (
        <div className="modal modal-open items-end sm:items-center">
          <div className="modal-box max-w-3xl w-full p-0 bg-base-100 border border-base-300 shadow-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setViewingPost(null)} 
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50 text-base-content hover:bg-base-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 md:p-10">
              <PostView 
                post={viewingPost} 
                currentUser={user} 
                onLike={() => handleLikeToggle(viewingPost._id)} 
              />
            </div>
          </div>
          <div className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={() => setViewingPost(null)}></div>
        </div>
      )}
    </div>
  );
};

export default Home;