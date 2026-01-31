import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import { Save, Camera, X, Loader2, Upload, ShieldCheck, Edit3 } from "lucide-react"; // 👈 Added Edit3 icon
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../utils/cloudinary";

const EditUserModal = ({ isOpen, onClose }) => {
  const { user, setUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState(""); 
  const fileInputRef = useRef(null);

  const MAX_CHAR_NAME = 30;
  const MAX_CHAR_BIO = 160;

  // 🚀 SYNC: This ensures that every time the modal opens, 
  // it pulls the freshest data (including the new bio) from AuthContext
  useEffect(() => {
    if (user && isOpen) {
      setUsername(user.username || "");
      setBio(user.bio || ""); 
      setPreview(user.profilePic || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const cloudinaryData = await uploadToCloudinary(file);
      if (!cloudinaryData) throw new Error("Cloudinary upload failed");

      const res = await userAPI.uploadProfilePic({ 
        url: cloudinaryData.url, 
        publicId: cloudinaryData.publicId 
      });

      // Update global state with new pic
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser); 
      setPreview(updatedUser.profilePic);
      
      toast.success("Photo updated!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userAPI.updateProfile({ username, bio });
      
      // 🚀 IMPORTANT: Update global state so the Bio "stays" saved
      setUser(res.data); 
      
      toast.success("Profile updated!");
      setTimeout(() => onClose(), 300);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-[#12141a] w-full max-w-md rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        
        <button 
          onClick={onClose} 
          disabled={loading}
          className="absolute right-4 top-4 z-10 btn btn-ghost btn-circle btn-sm text-white/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-black text-white mb-6 italic tracking-tighter uppercase flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-primary" /> User Settings
          </h2>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="avatar mb-4 relative group">
              <div className="w-28 h-28 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-[#12141a] overflow-hidden bg-neutral">
                {preview ? (
                  <img src={preview} alt="avatar" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-4xl font-bold flex items-center justify-center h-full text-white">
                    {username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <button 
                onClick={() => !loading && fileInputRef.current.click()}
                className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm border-2 border-[#12141a]"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-bold text-xl truncate max-w-[200px]">{username}</span>
              {isAdmin && (
                <span className="badge badge-primary badge-sm font-black py-3 px-2">
                  <ShieldCheck className="w-3 h-3 mr-1" /> ADMIN
                </span>
              )}
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-5">
            {/* Display Name */}
            <div className="form-control">
              <div className="flex justify-between items-end mb-1">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Display Name</label>
                <span className={`text-[10px] font-bold ${username.length >= MAX_CHAR_NAME ? 'text-error' : 'text-white/20'}`}>
                  {username.length}/{MAX_CHAR_NAME}
                </span>
              </div>
              <input 
                type="text" 
                className="input bg-white/5 border-white/10 text-white w-full focus:border-primary transition-all rounded-xl" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                maxLength={MAX_CHAR_NAME}
                required
              />
            </div>

            {/* Bio / Tagline */}
            <div className="form-control">
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-1">
                  <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Bio / Tagline</label>
                  <Edit3 className="w-3 h-3 text-primary/40" /> 
                </div>
                <span className={`text-[10px] font-bold ${bio.length >= MAX_CHAR_BIO ? 'text-error' : 'text-white/20'}`}>
                  {bio.length}/{MAX_CHAR_BIO}
                </span>
              </div>
              <textarea 
                className="textarea bg-white/5 border-white/10 text-white w-full focus:border-primary transition-all rounded-xl resize-none h-24 leading-relaxed" 
                placeholder="Share your story..."
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                maxLength={MAX_CHAR_BIO}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1 text-white/50">
                CANCEL
              </button>
              <button 
                type="submit"
                disabled={loading} 
                className="btn btn-primary flex-1 font-bold shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-4 h-4 mr-2" /> SAVE</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;