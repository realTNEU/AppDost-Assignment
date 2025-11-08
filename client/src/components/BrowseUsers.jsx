import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedAvatarUrl } from "../utils/cloudinary.js";

export default function BrowseUsers({ onClose }) {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/users`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_BASE]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#12041b]/95 border border-purple-900/30 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-900/30">
            <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-purple-200">
              Browse Users
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl sm:text-2xl transition p-1"
            >
              ×
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#0f0714]/60 border border-purple-800/30 text-gray-100 placeholder-gray-500 focus:border-fuchsia-500 outline-none text-sm"
            />
          </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full"
              />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              {searchTerm ? "No users found" : "No users available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user._id || user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link
                      to={`/user/${user._id || user.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-900/30 bg-[#0f0714]/40 hover:border-fuchsia-500/40 hover:bg-[#0f0714]/60 transition"
                    >
                      <img
                        src={
                          user.avatarUrl
                            ? getOptimizedAvatarUrl(user.avatarUrl)
                            : `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.firstName}`
                        }
                        alt="avatar"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-purple-800 object-cover flex-shrink-0"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-purple-200 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        {user.bio && (
                          <div className="text-xs text-gray-400 mt-1 line-clamp-1 truncate">
                            {user.bio}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-fuchsia-400 flex-shrink-0 hidden sm:inline">View →</span>
                      <span className="text-xs text-fuchsia-400 flex-shrink-0 sm:hidden">→</span>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

