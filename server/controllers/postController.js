// server/controllers/postController.js
import Post from "../models/Post.js";

// create post
export const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: "Content required" });

    const post = await Post.create({ author: req.user._id, content: content.trim(), imageUrl });
    await post.populate("author", "firstName lastName avatarUrl");
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Create post failed", error: err.message });
  }
};

// get feed (latest first)
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "firstName lastName avatarUrl").sort({ createdAt: -1 }).limit(100);
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch feed" });
  }
};

// update (only author)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, imageUrl } = req.body;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

    if (content !== undefined) post.content = content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;
    await post.save();
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// delete
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

    await post.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// toggle like
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const idx = post.likes.findIndex((u) => u.toString() === req.user._id.toString());
    if (idx === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    res.json({ likesCount: post.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: "Like toggle failed" });
  }
};
