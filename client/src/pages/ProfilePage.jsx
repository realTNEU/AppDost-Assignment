import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOptimizedPostImageUrl, getOptimizedAvatarUrl } from "../utils/cloudinary.js";

export default function ProfilePage() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [submittingPosts, setSubmittingPosts] = useState({});
  const [editPost, setEditPost] = useState(null);
  const [savingPost, setSavingPost] = useState(false);
  const [editPostImage, setEditPostImage] = useState(null);

  const [newPost, setNewPost] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const userRes = await fetch(`${API_BASE}/users/me`, {
          credentials: "include",
        });
        const data = await userRes.json();
        if (!userRes.ok) throw new Error(data.message || "Unauthorized");

        const postsRes = await fetch(`${API_BASE}/posts/user`, {
          credentials: "include",
        });
        const postsData = await postsRes.json();

        if (!ignore) {
          setUser(data.user);
          setEditForm({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            bio: data.user.bio || "",
            avatarUrl: data.user.avatarUrl || "",
          });
          setPosts(Array.isArray(postsData) ? postsData : []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          if (err.message.toLowerCase().includes("unauthorized")) {
            navigate("/auth");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [API_BASE, navigate]);

  const currentUserId = useMemo(() => user?.id || user?._id || null, [user]);
  const headers = useMemo(() => ({ "Content-Type": "application/json" }), []);

  const updatePostState = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const setPostSubmitting = (postId, value) => {
    setSubmittingPosts((prev) => ({ ...prev, [postId]: value }));
  };

  const handleLike = async (postId) => {
    try {
      setPostSubmitting(postId, true);
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
      setPostSubmitting(postId, false);
    }
  };

  const handleDislike = async (postId) => {
    try {
      setPostSubmitting(postId, true);
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
      setPostSubmitting(postId, false);
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = async (postId) => {
    const draft = commentDrafts[postId];
    if (!draft || !draft.trim()) return;

    try {
      setPostSubmitting(postId, true);
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
      setPostSubmitting(postId, false);
    }
  };

  const matchesUser = (value) => {
    if (!currentUserId) return false;
    if (!value) return false;
    if (typeof value === "string") return value === currentUserId;
    if (typeof value === "object") {
      if (value._id && value._id === currentUserId) return true;
      if (value.id && value.id === currentUserId) return true;
      if (typeof value.toString === "function") {
        return value.toString() === currentUserId;
      }
    }
    return false;
  };

  const isLiked = (post) =>
    currentUserId && Array.isArray(post.likes)
      ? post.likes.some((like) => matchesUser(like))
      : false;

  const isDisliked = (post) =>
    currentUserId && Array.isArray(post.dislikes)
      ? post.dislikes.some((dislike) => matchesUser(dislike))
      : false;

  const openEditPost = (post) => {
    setEditPost({
      id: post._id,
      text: post.text,
      image: post.image || "",
    });
  };

  const closeEditPost = () => {
    setEditPost(null);
    setSavingPost(false);
    setEditPostImage(null);
  };

  const handleEditChange = (field, value) => {
    setEditPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setEditPostImage(file);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editPost?.id) return;

    try {
      setSavingPost(true);
      const formData = new FormData();
      formData.append("text", editPost.text);
      
      if (editPostImage) {
        formData.append("image", editPostImage);
      } else if (editPost.image && !editPost.image.startsWith('data:')) {
        formData.append("image", editPost.image);
      }

      const res = await fetch(`${API_BASE}/posts/${editPost.id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update post");
      updatePostState(data.post);
      closeEditPost();
      setEditPostImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPost(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setPostSubmitting(postId, true);
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete post");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setError(err.message);
    } finally {
      setPostSubmitting(postId, false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setPostImage(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

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
      if (!res.ok) throw new Error(data.message);

      setPosts((p) => [data.post, ...p]);
      setNewPost("");
      setPostImage(null);
      const fileInput = document.querySelector('#post-image-input');
      if (fileInput) fileInput.value = '';
      setCommentDrafts((prev) => ({ ...prev, [data.post._id]: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Avatar size should be less than 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", editForm.firstName);
      formData.append("lastName", editForm.lastName);
      formData.append("bio", editForm.bio);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (editForm.avatarUrl && !editForm.avatarUrl.startsWith('data:')) {
        formData.append("avatarUrl", editForm.avatarUrl);
      }

      const res = await fetch(`${API_BASE}/users/update-profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      setShowEdit(false);
      setAvatarFile(null);
      // Reset file input
      const fileInput = document.querySelector('#avatar-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );

  return (
    <div className="relative z-10 px-4 sm:px-6 pb-20 text-gray-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#2a0b52_0%,transparent_70%)] opacity-60" />
      </div>
      <div className="mx-auto mt-4 sm:mt-6 grid w-full max-w-6xl grid-cols-1 gap-6 sm:gap-10 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-2xl sm:rounded-3xl border border-purple-900/30 bg-[#12041b]/50 p-4 sm:p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-3xl backdrop-saturate-180 md:col-span-1">
          <img
            src={
              user?.avatarUrl
                ? getOptimizedAvatarUrl(user.avatarUrl)
                : "https://api.dicebear.com/8.x/avataaars/svg?seed=" + user?.firstName
            }
            alt="avatar"
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-purple-700 shadow-lg"
            loading="lazy"
            decoding="async"
          />
          <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-poppins font-semibold text-purple-300 break-words px-2">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 break-all px-2">{user.email}</p>
          <p className="mt-2 sm:mt-3 text-xs text-gray-400 italic max-w-xs break-words px-2">
            {user.bio || "No bio yet"}
          </p>
          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 sm:mt-6 bg-linear-to-r from-purple-600 to-fuchsia-600 px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>

        <div className="flex flex-col gap-6 md:col-span-2">
          <form
            onSubmit={handleCreatePost}
            className="bg-[#12041b]/40 border border-purple-900/20 rounded-2xl p-4 sm:p-6 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
          >
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something..."
              className="w-full bg-[#0f0714]/60 border border-purple-800/30 text-gray-100 p-3 rounded-lg outline-none resize-none focus:border-fuchsia-500 min-h-[80px] sm:min-h-[100px] text-sm"
            />
            {postImage && (
              <div className="mt-3 relative">
                <img
                  src={URL.createObjectURL(postImage)}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg border border-purple-800/30"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPostImage(null);
                    const fileInput = document.querySelector('#post-image-input');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0 flex-col sm:flex-row">
              <label className="cursor-pointer text-xs text-gray-400 hover:text-fuchsia-300 transition px-3 py-1.5 rounded-lg hover:bg-purple-900/20">
                <input
                  id="post-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="flex items-center gap-1.5">
                  <span>📷</span>
                  <span className="hidden sm:inline">Add Image</span>
                  <span className="sm:hidden">Image</span>
                </span>
              </label>
              <button
                type="submit"
                disabled={posting || !newPost.trim()}
                className="bg-linear-to-r from-purple-600 to-fuchsia-600 text-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 w-full sm:w-auto"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-5">
            {posts.length === 0 && (
              <div className="text-gray-500 text-center py-10 border border-purple-900/30 rounded-xl bg-[#0f0714]/40">
                You haven’t posted anything yet.
              </div>
            )}

            {posts.map((p) => {
              const likeActive = isLiked(p);
              const dislikeActive = isDisliked(p);
              const draft = commentDrafts[p._id] || "";
              const busy = submittingPosts[p._id];
              const avatar = user?.avatarUrl
                ? getOptimizedAvatarUrl(user.avatarUrl)
                : "https://api.dicebear.com/8.x/avataaars/svg?seed=" + user?.firstName;

              return (
                <article
                  key={p._id}
                  className="bg-[#12041b]/40 border border-purple-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(155,66,255,0.25)]"
                >
                  <header className="flex items-start justify-between gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-purple-800 object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-purple-300 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(p.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditPost(p)}
                        className="text-xs bg-[#1a0b2e]/70 border border-purple-900/30 px-2 sm:px-3 py-1 rounded-full text-gray-300 hover:text-fuchsia-300 hover:border-fuchsia-500/50 transition whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(p._id)}
                        disabled={submittingPosts[p._id]}
                        className="text-xs bg-[#1a0b2e]/70 border border-red-900/30 px-2 sm:px-3 py-1 rounded-full text-gray-300 hover:text-red-300 hover:border-red-500/50 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </header>

                  <p className="text-gray-200 text-sm md:text-base mt-3 sm:mt-4 whitespace-pre-line break-words overflow-wrap-anywhere">
                    {p.text}
                  </p>

                  {p.image && (
                    <img
                      src={getOptimizedPostImageUrl(p.image, { width: 800, quality: 'auto:good' })}
                      alt="post"
                      className="w-full max-h-64 sm:max-h-80 object-cover rounded-lg sm:rounded-xl border border-purple-900/30 mt-3 sm:mt-4"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                  )}

                  <footer className="mt-4 sm:mt-5 flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-400 flex-wrap">
                      <button
                        onClick={() => handleLike(p._id)}
                        disabled={busy}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                          likeActive
                            ? "border-fuchsia-500/60 bg-fuchsia-500/10 text-fuchsia-300"
                            : "border-purple-900/30 hover:border-fuchsia-500/40"
                        }`}
                      >
                        <span role="img" aria-label="like">
                          👍
                        </span>
                        <span>{p.likes?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleDislike(p._id)}
                        disabled={busy}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                          dislikeActive
                            ? "border-purple-500/60 bg-purple-500/10 text-purple-200"
                            : "border-purple-900/30 hover:border-purple-500/40"
                        }`}
                      >
                        <span role="img" aria-label="dislike">
                          👎
                        </span>
                        <span>{p.dislikes?.length || 0}</span>
                      </button>
                      <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-purple-900/30">
                        <span role="img" aria-label="comments">
                          💬
                        </span>
                        <span>{p.comments?.length || 0}</span>
                      </div>
                    </div>

                    <div className="bg-[#0f0714]/50 border border-purple-900/30 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex flex-col gap-3 max-h-44 overflow-y-auto pr-1">
                        {p.comments && p.comments.length > 0 ? (
                          p.comments.map((comment) => (
                            <div
                              key={comment._id || `${comment.user?._id}-${comment.createdAt}`}
                              className="flex gap-3"
                            >
                              <img
                                src={
                                  comment.user?.avatarUrl
                                    ? getOptimizedAvatarUrl(comment.user.avatarUrl)
                                    : `https://api.dicebear.com/8.x/avataaars/svg?seed=${comment.user?.firstName || "comment"}`
                                }
                                alt="comment avatar"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-purple-900/40 object-cover flex-shrink-0"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="bg-[#12041b]/60 border border-purple-800/30 rounded-lg sm:rounded-xl px-3 py-2 flex-1 min-w-0">
                                <div className="text-xs text-purple-200 font-medium truncate">
                                  {comment.user?.firstName} {comment.user?.lastName}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </div>
                                <p className="text-xs text-gray-200 mt-1 whitespace-pre-line break-words overflow-wrap-anywhere">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500 text-center py-4">
                            No comments yet.
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <input
                          value={draft}
                          onChange={(e) => handleCommentChange(p._id, e.target.value)}
                          placeholder="Leave a comment..."
                          className="flex-1 px-4 py-3 rounded-xl bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100 text-sm"
                        />
                        <button
                          onClick={() => handleAddComment(p._id)}
                          disabled={busy || !draft.trim()}
                          className="px-4 py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium disabled:opacity-60"
                        >
                          {busy ? "..." : "Send"}
                        </button>
                      </div>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-[#12041b]/80 p-8 rounded-2xl border border-purple-800/30 w-full max-w-md text-gray-100 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <h3 className="text-xl font-poppins font-semibold mb-6 text-center bg-linear-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent">
              Edit Profile
            </h3>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100"
                />
                <input
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100"
                />
              </div>
              <textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                placeholder="Your bio..."
                className="px-4 py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100 resize-none"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Avatar</label>
                <div className="flex items-center gap-3">
                  {editForm.avatarUrl && (
                    <img
                      src={editForm.avatarUrl}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover border border-purple-800/30"
                    />
                  )}
                  <label className="cursor-pointer text-sm text-fuchsia-400 hover:text-fuchsia-300 border border-fuchsia-500/30 px-4 py-2 rounded-lg">
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    {avatarFile ? "Change Avatar" : "Upload Avatar"}
                  </label>
                </div>
                <p className="text-xs text-gray-500">Or enter URL:</p>
                <input
                  value={editForm.avatarUrl && !editForm.avatarUrl.startsWith('data:') ? editForm.avatarUrl : ""}
                  onChange={(e) => {
                    setEditForm({ ...editForm, avatarUrl: e.target.value });
                    setAvatarFile(null);
                  }}
                  placeholder="Avatar URL (optional)"
                  className="px-4 py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-transparent border border-purple-800/30 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-purple-600 to-fuchsia-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-[#12041b]/80 p-8 rounded-2xl border border-purple-800/30 w-full max-w-lg text-gray-100 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <h3 className="text-xl font-poppins font-semibold mb-6 text-center bg-linear-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent">
              Edit Post
            </h3>
            <form onSubmit={handleUpdatePost} className="flex flex-col gap-4">
              <textarea
                value={editPost.text}
                onChange={(e) => handleEditChange("text", e.target.value)}
                className="w-full min-h-[160px] px-4 py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100 resize-none"
                placeholder="Update your post..."
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Post Image</label>
                {editPostImage && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(editPostImage)}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded-lg border border-purple-800/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditPostImage(null);
                        const fileInput = document.querySelector('#edit-post-image-input');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {!editPostImage && editPost.image && (
                  <div className="relative">
                    <img
                      src={editPost.image}
                      alt="Current"
                      className="w-full max-h-64 object-cover rounded-lg border border-purple-800/30"
                    />
                  </div>
                )}
                <label className="cursor-pointer text-sm text-fuchsia-400 hover:text-fuchsia-300 border border-fuchsia-500/30 px-4 py-2 rounded-lg text-center">
                  <input
                    id="edit-post-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                  {editPostImage ? "Change Image" : "Upload New Image"}
                </label>
                <p className="text-xs text-gray-500">Or enter URL:</p>
                <input
                  value={editPost.image && !editPost.image.startsWith('data:') ? editPost.image : ""}
                  onChange={(e) => {
                    handleEditChange("image", e.target.value);
                    setEditPostImage(null);
                  }}
                  className="px-4 py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100"
                  placeholder="Image URL (optional)"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeEditPost}
                  className="flex-1 px-4 py-3 rounded-lg bg-transparent border border-purple-800/30 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPost}
                  className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-purple-600 to-fuchsia-600 text-white disabled:opacity-60"
                >
                  {savingPost ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
