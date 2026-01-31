import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { postAPI, userAPI } from "../utils/api"; // 🚀 Ensure userAPI is imported
import PostCard from "../components/PostCard";
import PostView from "../components/PostView";
import { Loader2, X, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [viewingPost, setViewingPost] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 1. Fetch the posts for the grid
        const postResponse = await postAPI.getAllPosts();
        const filteredPosts = postResponse.data.filter(p => p.author?.username === username);
        setPosts(filteredPosts);

        // 2. Fetch the ACTUAL user profile to get the bio
        // This hits the backend route we just updated to include the bio
        try {
          const userResponse = await userAPI.getProfile(username); 
          if (userResponse.data) {
            setAuthorInfo(userResponse.data);
          }
        } catch (err) {
          console.warn("Dedicated profile fetch failed, falling back to post data.");
          if (filteredPosts.length > 0) {
            setAuthorInfo(filteredPosts[0].author);
          }
        }

        // 3. If viewing OWN profile, sync with AuthContext for instant bio updates
        if (currentUser?.username === username) {
          setAuthorInfo(currentUser);
        }

      } catch (error) {
        console.error("Profile Load Error:", error);
        toast.error("User not found");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser]); // 🚀 Added currentUser to dependency to sync bio changes

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-screen">
      
      {/* 🚀 PROFILE HEADER */}
      <div className="flex flex-col items-center mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative mb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden bg-base-300 shadow-2xl">
            {authorInfo?.profilePic ? (
              <img 
                src={authorInfo.profilePic} 
                alt={username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral text-neutral-content">
                <UserIcon className="w-16 h-16 opacity-20" />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-base-content mb-2">
          @{username}
        </h1>

        {/* 🚀 BIO SECTION */}
        <div className="max-w-xl mb-6">
          {authorInfo?.bio ? (
            <p className="text-base-content/80 text-lg italic font-medium leading-relaxed px-4">
              "{authorInfo.bio}"
            </p>
          ) : (
            <p className="text-base-content/30 text-sm uppercase tracking-widest font-bold italic">
              Independent Creator
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="badge badge-primary font-black px-4 py-3 uppercase tracking-tighter">
            {posts.length} Releases
          </div>
        </div>
      </div>

      <hr className="border-base-300 mb-12" />

      {/* POSTS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
      ) : posts.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="break-inside-avoid">
              <PostCard 
                post={post} 
                currentUser={currentUser}
                onRead={() => setViewingPost(post)} 
                isDashboard={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-40 border-2 border-dashed border-base-300 rounded-3xl">
          <p className="text-xl font-bold uppercase italic tracking-widest">No tracks released yet.</p>
        </div>
      )}

      {/* MODAL SECTION */}
      {viewingPost && (
        <div className="modal modal-open items-end sm:items-center">
          <div className="modal-box max-w-3xl w-full p-0 bg-base-100 border border-base-300 shadow-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setViewingPost(null)} 
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 md:p-10">
              <PostView 
                post={viewingPost} 
                currentUser={currentUser} 
              />
            </div>
          </div>
          <div className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={() => setViewingPost(null)}></div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;