import ImagePost from '../Model/ImagePost.js';

// Create a new post
export const createPost = async (req, res) => {
  const { Username, Content, PostUrl } = req.body;

  try {
    const newPost = new ImagePost({
      Username,
      Content,
      PostUrl: PostUrl || null, // Handle optional PostUrl
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
};

// Like a post
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { Username } = req.body;

  try {
    const post = await ImagePost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if user has already liked the post
    if (post.Likes.includes(Username)) {
      return res.status(400).json({ message: 'User already liked this post.' });
    }

    post.Likes.push(Username);
    await post.save();
    res.status(200).json({ message: 'Post liked successfully!', post });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post.' });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { username, comment } = req.body;

  try {
    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid Post ID.' });
    }

    const post = await ImagePost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Push comment
    post.Comments.push({ username, comment }); // Use lowercase consistently
    await post.save();

    res.status(200).json({ message: 'Comment added successfully!', post });
  } catch (error) {
    console.error('Error adding comment:', error.message || error);
    res.status(500).json({ message: 'Failed to add comment.', error: error.message });
  }
};



// Get All Posts
export const getAllPosts = async (req, res) => {
    try {
      const posts = await ImagePost.find();
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
};


