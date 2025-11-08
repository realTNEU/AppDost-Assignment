import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOptimizedPostImageUrl, getOptimizedAvatarUrl } from "../utils/cloudinary.js";

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = useMemo(
    () => currentUser?.id || currentUser?._id || null,
    [currentUser]
  );

  const isOwnProfile = useMemo(
    () => currentUserId && (currentUserId === userId || currentUser?._id === userId),
    [currentUserId, userId, currentUser]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        try {
          const currentUserRes = await fetch(`${API_BASE}/users/me`, {
            credentials: "include",
          });
          if (currentUserRes.ok) {
            const data = await currentUserRes.json();
            setCurrentUser(data.user);
          }
        } catch (err) {
        }

        const userRes = await fetch(`${API_BASE}/users/${userId}`, {
          credentials: "include",
        });
        if (!userRes.ok) {
          throw new Error("User not found");
        }
        const userData = await userRes.json();

        const postsRes = await fetch(`${API_BASE}/posts/user/${userId}`, {
          credentials: "include",
        });
        const postsData = await postsRes.ok ? await postsRes.json() : [];

        setUser(userData.user);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId, API_BASE]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-gray-400">
        <p className="text-lg">{error || "User not found"}</p>
        <Link
          to="/feed"
          className="text-fuchsia-400 hover:text-fuchsia-300 underline"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 px-4 sm:px-6 pb-20 text-gray-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#260947_0%,transparent_70%)] opacity-55" />
      </div>
      <div className="mx-auto mt-4 sm:mt-6 flex w-full max-w-5xl flex-col gap-6 sm:gap-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-purple-900/30 bg-[#12041b]/40 p-4 sm:p-8 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
        >
          <motion.img
            src={
              user.avatarUrl
                ? getOptimizedAvatarUrl(user.avatarUrl)
                : `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.firstName}`
            }
            alt="avatar"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-700/50 object-cover shadow-[0_8px_32px_rgba(168,85,247,0.4)]"
            loading="lazy"
            decoding="async"
          />
          <div className="text-center px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-poppins font-semibold text-purple-200 break-words">
              {user.firstName} {user.lastName}
            </h1>
            {user.bio && (
              <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-md break-words mx-auto">{user.bio}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isOwnProfile && (
            <Link
              to="/profile"
              className="rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white"
            >
              Edit Your Profile
            </Link>
          )}
        </motion.div>

        <div>
          <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-purple-200 mb-4 sm:mb-6 px-2">
            Posts ({posts.length})
          </h2>
          <div className="flex flex-col gap-4 sm:gap-6">
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 py-12 sm:py-16 border border-purple-900/30 rounded-xl sm:rounded-2xl bg-[#0f0714]/40 px-4">
                {isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}
              </div>
            ) : (
              posts.map((post) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#12041b]/40 border border-purple-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
                >
                  <div className="text-xs text-gray-500 mb-3 sm:mb-4">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                  <p className="text-gray-200 text-sm md:text-base whitespace-pre-line mb-3 sm:mb-4 break-words overflow-wrap-anywhere">
                    {post.text}
                  </p>
                  {post.image && (
                    <img
                      src={getOptimizedPostImageUrl(post.image, { width: 800, quality: 'auto:good' })}
                      alt="post"
                      className="w-full max-h-64 sm:max-h-96 object-cover rounded-xl sm:rounded-2xl border border-purple-900/30"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                  )}
                  <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 text-xs text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span>👍</span>
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👎</span>
                      <span>{post.dislikes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

