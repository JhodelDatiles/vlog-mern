import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Added for Back button
import { adminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { 
  Trash2, 
  Edit2, 
  Shield, 
  User as UserIcon, 
  Loader2, 
  Search, 
  ArrowLeft // 🚀 Added icon
} from "lucide-react";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate(); // 🚀 Initialize navigate

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) { 
      toast.error("Failed to load users"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Delete user "${username}"? All their posts will be removed.`)) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter((u) => u._id !== userId));
        toast.success("User deleted");
      } catch (error) { toast.error("Delete failed"); }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    document.getElementById("edit_modal").showModal();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.updateUser(editingUser._id, editingUser);
      setUsers(users.map((u) => (u._id === editingUser._id ? response.data : u)));
      toast.success("User updated");
      document.getElementById("edit_modal").close();
    } catch (error) { toast.error("Update failed"); }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 🚀 Updated Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-circle btn-ghost border border-white/10 hover:bg-white/10 transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">User Management</h1>
            <p className="text-sm text-base-content/50">Oversee community accounts and permissions</p>
          </div>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="input input-bordered w-full pl-10 bg-[#12141a] border-white/10 focus:border-primary transition-all" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card bg-[#12141a] shadow-2xl border border-white/5 overflow-hidden rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr className="bg-white/5 text-white/70 uppercase text-xs tracking-widest border-b border-white/10">
                <th className="py-5 px-6">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                  <td className="px-6">
                    <div className="flex items-center gap-3">
                      {/* 🚀 ADDED PROFILE PIC SECTION */}
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10 bg-neutral ring-1 ring-white/10">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt={user.username} />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-xs font-black uppercase text-white/40">
                              {user.username[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-white/90">{user.username}</span>
                    </div>
                  </td>
                  <td className="text-white/60">{user.email}</td>
                  <td>
                    <div className={`badge badge-sm gap-2 font-bold py-3 px-4 ${user.role === 'admin' ? 'badge-secondary' : 'badge-ghost opacity-70'}`}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3"/> : <UserIcon className="w-3 h-3"/>}
                      {user.role}
                    </div>
                  </td>
                  <td className="text-white/40">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="text-right px-6">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(user)} className="btn btn-ghost btn-sm text-info hover:bg-info/10">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id, user.username)} 
                        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                        disabled={user._id === (currentUser?.id || currentUser?._id)}
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box bg-[#12141a] border border-white/10">
          <h3 className="font-black text-2xl mb-6 text-white uppercase italic">Edit User Permissions</h3>
          {editingUser && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label text-xs uppercase font-bold text-white/50">Username</label>
                <input 
                  type="text" 
                  className="input input-bordered bg-black/20 border-white/10" 
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label text-xs uppercase font-bold text-white/50">Role</label>
                <select 
                  className="select select-bordered bg-black/20 border-white/10"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary px-8">Save Changes</button>
                <button type="button" onClick={() => document.getElementById("edit_modal").close()} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserManagement;