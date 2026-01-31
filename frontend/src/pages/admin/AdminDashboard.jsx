import { useState, useEffect } from "react";
import { adminAPI, postAPI } from "../../utils/api";
import { Users, FileText, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    postCount: 0,
    adminCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        postAPI.getAllPosts()
      ]);

      const admins = usersRes.data.filter(u => u.role === 'admin').length;

      setStats({
        userCount: usersRes.data.length,
        postCount: postsRes.data.length,
        adminCount: admins
      });
    } catch (error) {
      toast.error("Error loading dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-secondary" />
          Admin Overview
        </h1>
        <p className="text-base-content/60 mt-2">Real-time status of the iPaskil community.</p>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* User Stat */}
        <div className="stats shadow bg-base-100 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title font-bold">Total Users</div>
            <div className="stat-value text-primary">{stats.userCount}</div>
            <div className="stat-desc text-secondary font-medium">{stats.adminCount} Administrators</div>
          </div>
        </div>

        {/* Post Stat */}
        <div className="stats shadow bg-base-100 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FileText className="w-8 h-8" />
            </div>
            <div className="stat-title font-bold">Total Posts</div>
            <div className="stat-value text-secondary">{stats.postCount}</div>
            <div className="stat-desc">Community Contributions</div>
          </div>
        </div>

        {/* Engagement Stat */}
        <div className="stats shadow bg-base-100 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-accent">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title font-bold">Platform Status</div>
            <div className="stat-value text-accent font-mono text-2xl uppercase">Active</div>
            <div className="stat-desc">All systems operational</div>
          </div>
        </div>
      </div>

      {/* QUICK LINKS / NAVIGATION */}
      <h2 className="text-xl font-bold mb-4">Management Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/admin/users" 
          className="group p-6 bg-base-100 border border-base-300 rounded-2xl hover:border-primary transition-all shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Manage Users</h3>
              <p className="text-sm opacity-60">Edit profiles, change roles, or remove accounts.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link 
          to="/admin/posts" 
          className="group p-6 bg-base-100 border border-base-300 rounded-2xl hover:border-secondary transition-all shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Moderate Posts</h3>
              <p className="text-sm opacity-60">View all community content and delete violations.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;