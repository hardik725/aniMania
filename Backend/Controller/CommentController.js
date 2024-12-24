import Comment from "../Model/Comment.js";

// Controller to create a new comment for a specific post
export const createComment = async (req, res) => {
  const { postId, username, content } = req.body;

  try {
    const newComment = new Comment({
      postId,
      username,
      content,
    });

    await newComment.save();
    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

// Controller to fetch all comments for a specific post
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};
