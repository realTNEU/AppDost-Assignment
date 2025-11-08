import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedPostImageUrl, getOptimizedAvatarUrl } from "../utils/cloudinary.js";
import BrowseUsers from "../components/BrowseUsers.jsx";

// Memoized Post Component for better performance
const PostCard = memo(({ post, currentUserId, onLike, onDislike, onComment, commentDraft, onCommentChange, submitting }) => {
  const likeActive = useMemo(() => {
    if (!currentUserId || !Array.isArray(post.likes)) return false;
    return post.likes.some(like => {
      if (typeof like === "string") return like === currentUserId;
      if (typeof like === "object") {
        return like._id === currentUserId || like.id === currentUserId;
      }
      return false;
    });
  }, [post.likes, currentUserId]);

  const dislikeActive = useMemo(() => {
    if (!currentUserId || !Array.isArray(post.dislikes)) return false;
    return post.dislikes.some(dislike => {
      if (typeof dislike === "string") return dislike === currentUserId;
      if (typeof dislike === "object") {
        return dislike._id === currentUserId || dislike.id === currentUserId;
      }
      return false;
    });
  }, [post.dislikes, currentUserId]);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-[#12041b]/50 border border-purple-900/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-purple-700/50 hover:shadow-[0_16px_48px_rgba(139,92,246,0.3)] hover:-translate-y-1"
    >
      <motion.header 
        className="flex items-center gap-3 sm:gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Link to={`/user/${post.user?._id || post.user?.id}`} className="group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.img
              src={
                post.user?.avatarUrl 
                  ? getOptimizedAvatarUrl(post.user.avatarUrl)
                  : `https://api.dicebear.com/8.x/avataaars/svg?seed=${post.user?.firstName || "user"}`
              }
              alt="avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-purple-700/50 object-cover cursor-pointer shadow-lg group-hover:border-fuchsia-400 transition-all duration-300"
              loading="lazy"
              decoding="async"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-fuchsia-400 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </Link>
        <div className="flex-1">
          <Link to={`/user/${post.user?._id || post.user?.id}`} className="block group">
            <motion.div 
              className="text-sm md:text-base font-semibold text-purple-200 group-hover:text-fuchsia-300 transition-all duration-200 inline-block"
              whileHover={{ x: 4 }}
            >
              {post.user?.firstName} {post.user?.lastName}
            </motion.div>
          </Link>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </motion.header>

      <motion.p 
        className="text-gray-200 text-sm md:text-base mt-3 sm:mt-4 whitespace-pre-line break-words overflow-wrap-anywhere"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {post.text}
      </motion.p>

      {post.image && (
        <motion.div
          className="mt-5 rounded-2xl overflow-hidden border border-purple-900/40 group cursor-pointer relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setImageExpanded(!imageExpanded)}
        >
          {!imageLoaded && !imageError && (
            <motion.div 
              className="w-full h-64 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full"
              />
            </motion.div>
          )}
          <motion.img
            src={getOptimizedPostImageUrl(post.image, { width: 800, quality: 'auto:good' })}
            alt="post"
            className={`w-full ${imageExpanded ? 'max-h-none' : 'max-h-96'} object-cover transition-all duration-300 ${imageLoaded ? 'block' : 'hidden'}`}
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Image load error:', e, post.image);
              setImageError(true);
            }}
            whileHover={{ scale: imageExpanded ? 1 : 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {imageLoaded && (
            <motion.div
              className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {imageExpanded ? 'Click to collapse' : 'Click to expand'}
            </motion.div>
          )}
          {imageError && (
            <div className="w-full h-32 bg-purple-900/20 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Failed to load image</span>
            </div>
          )}
        </motion.div>
      )}

      <motion.footer 
        className="mt-6 flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
          <motion.button
            onClick={() => currentUserId && onLike(post._id)}
            disabled={submitting || !currentUserId}
            whileHover={currentUserId ? { scale: 1.1, y: -2 } : {}}
            whileTap={currentUserId ? { scale: 0.9 } : {}}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
              likeActive
                ? "border-fuchsia-500/80 bg-fuchsia-500/20 text-fuchsia-300 shadow-lg shadow-fuchsia-500/20"
                : "border-purple-900/40 bg-purple-900/10 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 text-gray-300"
            } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <motion.span 
              role="img" 
              aria-label="like"
              animate={likeActive ? { rotate: [0, -14, 14, -14, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg"
            >
              👍
            </motion.span>
            <span className="font-medium text-xs sm:text-sm">{post.likes?.length || 0}</span>
          </motion.button>

          <motion.button
            onClick={() => currentUserId && onDislike(post._id)}
            disabled={submitting || !currentUserId}
            whileHover={currentUserId ? { scale: 1.1, y: -2 } : {}}
            whileTap={currentUserId ? { scale: 0.9 } : {}}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
              dislikeActive
                ? "border-purple-500/80 bg-purple-500/20 text-purple-200 shadow-lg shadow-purple-500/20"
                : "border-purple-900/40 bg-purple-900/10 hover:border-purple-500/60 hover:bg-purple-500/10 text-gray-300"
            } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <motion.span 
              role="img" 
              aria-label="dislike"
              animate={dislikeActive ? { rotate: [0, 14, -14, 14, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg"
            >
              👎
            </motion.span>
            <span className="font-medium text-xs sm:text-sm">{post.dislikes?.length || 0}</span>
          </motion.button>

          <motion.div 
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-purple-900/40 bg-purple-900/10 text-gray-300"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <span role="img" aria-label="comments" className="text-base sm:text-lg">💬</span>
            <span className="font-medium text-xs sm:text-sm">{post.comments?.length || 0}</span>
          </motion.div>
        </div>

        {currentUserId && (
          <div className="bg-[#0f0714]/50 border border-purple-900/30 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <motion.div
                      key={comment._id || `${comment.user?._id}-${comment.createdAt}`}
                      className="flex gap-3 group"
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      whileHover={{ x: 4 }}
                    >
                      <motion.img
                        src={
                          comment.user?.avatarUrl
                            ? getOptimizedAvatarUrl(comment.user.avatarUrl)
                            : `https://api.dicebear.com/8.x/avataaars/svg?seed=${comment.user?.firstName || "comment"}`
                        }
                        alt="comment avatar"
                        className="w-9 h-9 rounded-full border-2 border-purple-800/50 object-cover group-hover:border-fuchsia-400/60 transition-all duration-200"
                        loading="lazy"
                        decoding="async"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                      <motion.div 
                        className="bg-[#12041b]/70 border border-purple-800/40 rounded-xl px-4 py-2.5 flex-1 group-hover:border-purple-700/60 group-hover:bg-[#12041b]/80 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            to={`/user/${comment.user?._id || comment.user?.id}`}
                            className="text-xs text-purple-200 font-medium hover:text-fuchsia-300 transition-colors duration-200"
                          >
                            {comment.user?.firstName} {comment.user?.lastName}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500 mb-1.5">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-200 whitespace-pre-line leading-relaxed">
                          {comment.text}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No comments yet. Spark the conversation!
                  </div>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              className="flex gap-2 sm:gap-3 flex-col sm:flex-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                value={commentDraft}
                onChange={(e) => onCommentChange(post._id, e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#0f0714]/70 border-2 border-purple-800/40 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none text-gray-100 text-xs sm:text-sm transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (commentDraft.trim()) {
                      onComment(post._id);
                    }
                  }
                }}
              />
              <motion.button
                onClick={() => onComment(post._id)}
                disabled={submitting || !commentDraft.trim()}
                whileHover={!submitting && commentDraft.trim() ? { scale: 1.05, y: -2 } : {}}
                whileTap={!submitting && commentDraft.trim() ? { scale: 0.95 } : {}}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs sm:text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-[0_8px_20px_rgba(168,85,247,0.4)] hover:from-purple-500 hover:to-fuchsia-500"
              >
                {submitting ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                ) : (
                  "Send"
                )}
              </motion.button>
            </motion.div>
          </div>
        )}

        {!currentUserId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0f0714]/50 border border-purple-900/30 rounded-2xl p-4 text-center text-xs text-gray-400"
          >
            <Link to="/auth" className="text-fuchsia-400 hover:text-fuchsia-300 underline">
              Sign in to like, dislike, and comment
            </Link>
          </motion.div>
        )}
      </motion.footer>
    </motion.article>
  );
});

PostCard.displayName = 'PostCard';

export default function FeedPage() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [submittingPosts, setSubmittingPosts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [newPost, setNewPost] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [showBrowseUsers, setShowBrowseUsers] = useState(false);

  const headers = useMemo(
    () => ({ "Content-Type": "application/json" }),
    []
  );

  const currentUserId = useMemo(
    () => user?.id || user?._id || null,
    [user]
  );

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadFeed = useCallback(
    async (page = 1, { silent = false } = {}) => {
      try {
        if (!silent) setLoading(true);

        // Try to get user, but don't fail if not authenticated
        let userData = null;
        try {
          const userRes = await fetch(`${API_BASE}/users/me`, {
            credentials: "include",
          });
          if (userRes.ok) {
            const data = await userRes.json();
            userData = data.user;
          }
        } catch (err) {
          // User not authenticated, continue without user
        }

        // Fetch feed (works with or without auth)
        const feedRes = await fetch(`${API_BASE}/posts/feed?page=${page}&limit=10`, {
          credentials: "include",
        });

        if (!feedRes.ok) {
          throw new Error("Failed to load feed");
        }

        const feedData = await feedRes.json();

        if (!mountedRef.current) return;
        
        if (userData) {
          setUser(userData);
        }
        
        if (page === 1) {
          setPosts(Array.isArray(feedData.posts) ? feedData.posts : []);
        } else {
          setPosts(prev => [...prev, ...(Array.isArray(feedData.posts) ? feedData.posts : [])]);
        }
        
        setPagination(feedData.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalPosts: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
        setCurrentPage(page);
        setError("");
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err.message);
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
      }
    },
    [API_BASE]
  );

  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  useEffect(() => {
    const handleOpenBrowseUsers = () => {
      setShowBrowseUsers(true);
    };
    window.addEventListener('openBrowseUsers', handleOpenBrowseUsers);
    return () => window.removeEventListener('openBrowseUsers', handleOpenBrowseUsers);
  }, []);

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage && !loading) {
      loadFeed(currentPage + 1, { silent: true });
    }
  }, [pagination.hasNextPage, loading, currentPage, loadFeed]);

  const updatePostState = useCallback((updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  }, []);

  const handleLike = useCallback(async (postId) => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    try {
      setSubmittingPosts((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: "PATCH",
        credentials: "include",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to like");
      updatePostState(data.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingPosts((prev) => ({ ...prev, [postId]: false }));
    }
  }, [currentUserId, API_BASE, headers, updatePostState, navigate]);

  const handleDislike = useCallback(async (postId) => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    try {
      setSubmittingPosts((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`${API_BASE}/posts/${postId}/dislike`, {
        method: "PATCH",
        credentials: "include",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to dislike");
      updatePostState(data.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingPosts((prev) => ({ ...prev, [postId]: false }));
    }
  }, [currentUserId, API_BASE, headers, updatePostState, navigate]);

  const handleCommentChange = useCallback((postId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }));
  }, []);

  const handleAddComment = useCallback(async (postId) => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    const draft = commentDrafts[postId];
    if (!draft || !draft.trim()) return;

    try {
      setSubmittingPosts((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ text: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to comment");
      updatePostState(data.post);
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingPosts((prev) => ({ ...prev, [postId]: false }));
    }
  }, [currentUserId, commentDrafts, API_BASE, headers, updatePostState, navigate]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setPostImage(file);
    }
  }, []);

  const handleCreatePost = useCallback(async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUserId) return;

    try {
      setPosting(true);
      const formData = new FormData();
      formData.append("text", newPost);
      if (postImage) {
        formData.append("image", postImage);
      }

      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create post");

      // Add new post to the top of the feed
      setPosts((prev) => [data.post, ...prev]);
      setNewPost("");
      setPostImage(null);
      const fileInput = document.querySelector('#feed-post-image-input');
      if (fileInput) fileInput.value = '';
      setCommentDrafts((prev) => ({ ...prev, [data.post._id]: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }, [newPost, postImage, currentUserId, API_BASE]);

  if (loading && posts.length === 0) {
    return (
      <motion.div 
        className="flex min-h-[60vh] items-center justify-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  return (
    <div className="relative z-10 px-4 sm:px-6 pb-20 text-gray-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15)_0%,transparent_70%)] opacity-60" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#260947_0%,transparent_70%)] opacity-40" />
      </div>
      
      {/* Increased top spacing to fix navbar proximity issue */}
      <div className="mx-auto pt-8 sm:pt-12 md:pt-16 flex w-full max-w-5xl flex-col gap-8 md:gap-10">
        <motion.header 
          className="flex flex-col gap-4 md:gap-5 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-600 bg-clip-text text-transparent px-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Public Feed
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Dive into the latest posts from the PublicFeed community.
          </motion.p>
          {currentUserId && (
            <motion.div 
              className="flex items-center justify-center gap-4 flex-wrap mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={() => setShowBrowseUsers(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs sm:text-sm text-gray-300 hover:text-fuchsia-300 transition-all duration-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-900/20 border border-transparent hover:border-purple-700/30"
              >
                👥 Browse Users
              </motion.button>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto text-center sm:text-left"
              >
                <Link 
                  to="/profile" 
                  className="text-xs sm:text-sm text-gray-300 hover:text-fuchsia-300 transition-all duration-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-900/20 border border-transparent hover:border-purple-700/30 inline-block"
                >
                  View Your Profile
                </Link>
              </motion.div>
            </motion.div>
          )}
          {!currentUserId && (
            <motion.div 
              className="text-sm text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/auth" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium underline decoration-2 underline-offset-2 transition">
                Sign in
              </Link>
              <span className="mx-2">to interact with posts and share your thoughts</span>
            </motion.div>
          )}
        </motion.header>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2a0a3f]/60 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {currentUserId && (
          <motion.form
            onSubmit={handleCreatePost}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ boxShadow: "0_12px_40px_rgba(139,92,246,0.2)" }}
            className="bg-[#12041b]/50 border border-purple-900/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)] transition-all duration-300"
          >
            <motion.textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community..."
              className="w-full bg-[#0f0714]/70 border border-purple-800/40 text-gray-100 p-3 sm:p-4 rounded-xl outline-none resize-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 min-h-[100px] sm:min-h-[120px] text-sm transition-all duration-200"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            <AnimatePresence>
              {postImage && (
                <motion.div 
                  className="mt-4 relative group"
                  initial={{ opacity: 0, scale: 0.95, height: 0 }}
                  animate={{ opacity: 1, scale: 1, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={URL.createObjectURL(postImage)}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-xl border border-purple-800/40 shadow-lg"
                  />
                  <motion.button
                    type="button"
                    onClick={() => {
                      setPostImage(null);
                      const fileInput = document.querySelector('#feed-post-image-input');
                      if (fileInput) fileInput.value = '';
                    }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg backdrop-blur-sm"
                  >
                    ×
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between mt-4 sm:mt-5 gap-2 sm:gap-0">
              <motion.label 
                className="cursor-pointer text-xs sm:text-sm text-gray-400 hover:text-fuchsia-300 transition-all duration-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-900/20 border border-transparent hover:border-purple-700/30"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  id="feed-post-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span>📷</span>
                  <span className="hidden sm:inline">Add Image</span>
                  <span className="sm:hidden">Image</span>
                </span>
              </motion.label>
              <motion.button
                type="submit"
                disabled={posting || !newPost.trim()}
                whileHover={{ scale: posting || !newPost.trim() ? 1 : 1.05, y: -2 }}
                whileTap={{ scale: posting || !newPost.trim() ? 1 : 0.95 }}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-5 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] hover:from-purple-500 hover:to-fuchsia-500"
              >
                {posting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                    Posting...
                  </span>
                ) : (
                  "Post"
                )}
              </motion.button>
            </div>
          </motion.form>
        )}

        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {posts.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20 px-6 border-2 border-purple-900/40 rounded-3xl bg-gradient-to-br from-[#0f0714]/60 to-[#1a0a2e]/60 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="text-6xl mb-4"
                >
                  🌌
                </motion.div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">
                  No posts in the public feed yet
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Be the first to share something amazing!
                </p>
                {!currentUserId && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/auth"
                      className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] transition-all duration-200"
                    >
                      Sign in to get started
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                onLike={handleLike}
                onDislike={handleDislike}
                onComment={handleAddComment}
                commentDraft={commentDrafts[post._id] || ""}
                onCommentChange={handleCommentChange}
                submitting={submittingPosts[post._id]}
              />
            ))}
          </AnimatePresence>

          {loading && posts.length > 0 && (
            <motion.div
              className="flex justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full"
              />
            </motion.div>
          )}

          {pagination.hasNextPage && !loading && (
            <motion.button
              onClick={loadMore}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-200"
            >
              Load More Posts
            </motion.button>
          )}

        </div>
      </div>

      {showBrowseUsers && (
        <BrowseUsers onClose={() => setShowBrowseUsers(false)} />
      )}
    </div>
  );
}
