import Post from "../models/Post.js";

const populatePost = async (post) => {
  // If post is a lean document, we need to populate manually
  if (post.populate) {
    await post.populate([
      { path: "user", select: "firstName lastName avatarUrl" },
      { path: "comments.user", select: "firstName lastName avatarUrl" },
    ]);
    return post;
  }
  // For lean documents, return as is (already populated)
  return post;
};

export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Post text is required" });
    }

    // Use Cloudinary URL if file was uploaded, otherwise use provided image URL
    const imageUrl = req.file?.path || image || null;

    const post = await Post.create({
      user: req.user._id,
      text: text.trim(),
      image: imageUrl,
    });

    const populated = await populatePost(post);

    res.status(201).json({
      message: "Post created successfully",
      post: populated,
    });
  } catch (err) {
    console.error("Create post error:", err);
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate("user", "firstName lastName avatarUrl")
      .populate("comments.user", "firstName lastName avatarUrl")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .populate("user", "firstName lastName avatarUrl")
      .populate("comments.user", "firstName lastName avatarUrl")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get user posts error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch user posts", error: err.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find()
      .populate("user", "firstName lastName avatarUrl")
      .populate("comments.user", "firstName lastName avatarUrl")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Feed fetch error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch feed", error: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.some((likeId) => likeId.equals(userId));
    if (liked) {
      post.likes = post.likes.filter((likeId) => !likeId.equals(userId));
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter((dislikeId) => !dislikeId.equals(userId));
    }

    await post.save();
    const populated = await populatePost(post);

    res.json({
      message: liked ? "Like removed" : "Post liked",
      post: populated,
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    res
      .status(500)
      .json({ message: "Failed to toggle like", error: err.message });
  }
};

export const toggleDislike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const disliked = post.dislikes.some((dislikeId) => dislikeId.equals(userId));
    if (disliked) {
      post.dislikes = post.dislikes.filter((dislikeId) => !dislikeId.equals(userId));
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter((likeId) => !likeId.equals(userId));
    }

    await post.save();
    const populated = await populatePost(post);

    res.json({
      message: disliked ? "Dislike removed" : "Post disliked",
      post: populated,
    });
  } catch (err) {
    console.error("Toggle dislike error:", err);
    res
      .status(500)
      .json({ message: "Failed to toggle dislike", error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    const populated = await populatePost(post);

    res.status(201).json({
      message: "Comment added",
      post: populated,
    });
  } catch (err) {
    console.error("Add comment error:", err);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    // Handle both JSON and FormData
    const text = req.body.text;
    const image = req.body.image;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    if (text !== undefined) {
      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Post text cannot be empty" });
      }
      post.text = text.trim();
    }

    // Use Cloudinary URL if file was uploaded, otherwise use provided image URL
    if (req.file?.path) {
      post.image = req.file.path;
    } else if (image !== undefined) {
      // Handle both string URLs and FormData image field
      post.image = (typeof image === 'string' && image.trim()) ? image.trim() : null;
    }

    await post.save();
    const populated = await populatePost(post);

    res.json({
      message: "Post updated",
      post: populated,
    });
  } catch (err) {
    console.error("Update post error:", err);
    res
      .status(500)
      .json({ message: "Failed to update post", error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};
