import ImagePost from '../Model/ImagePost.js';

// Create a new post
export const createPost = async (req, res) => {
  const { username, content, postUrl } = req.body;
  if (!username || !content) {
    return res.status(400).json({ message: 'Username and Content are required.' });
  }

  try {
    const newPost = new Post({
      username,
      content,
      postUrl: postUrl || null, // If no postUrl, set it to null
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};


// Add a comment to a post
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { username, comment } = req.body;

  if (!username || !comment) {
    return res.status(400).json({ message: 'Username and Comment are required.' });
  }

  try {
    const post = await ImagePost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.comments.push({ username, comment });
    await post.save();
    
    res.status(200).json({ message: 'Comment added successfully!', post });
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(500).json({ message: 'Failed to add comment.', error: error.message });
  }
};

// Fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await ImagePost.find().sort({ createdAt: -1 }); // Fetch posts sorted by creation time
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ message: 'Failed to fetch posts.', error: error.message });
  }
};
