import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const Forums = ({ username, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  // Fetch all posts from the server
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://animania-backend-dmjs.onrender.com/post/allpost');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Handle like functionality
  const handleLike = async (postId) => {
    try {
      const response = await fetch(`https://animania-backend-dmjs.onrender.com/post/addlike/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username : username }),
      });
      if (!response.ok) throw new Error('Failed to like post');

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, Likes: [...post.Likes, username] } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle dislike functionality
  const handleDislike = async (postId) => {
    try {
      const response = await fetch(`https://animania-backend-dmjs.onrender.com/post/adddislike/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) throw new Error('Failed to dislike post');

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, Likes: post.Likes.filter((like) => like !== username) }
            : post
        )
      );
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  // Handle adding a comment
  const handleAddComment = async (postId, comment) => {
    try {
      const response = await fetch(`https://animania-backend-dmjs.onrender.com/post/addcomment/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, comment }),
      });
      if (!response.ok) throw new Error('Failed to add comment');

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, Comments: [...post.Comments, { Username: username, Comment: comment }] }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPost && !newPostImage) {
      alert('Please add text or an image to create a post.');
      return;
    }
  
    const formData = {
      Username: username,
      Content: newPost,
      PostUrl: newPostImage ? URL.createObjectURL(newPostImage) : null, // Generate a URL for image preview
    };
  
    try {
      const response = await fetch('https://animania-backend-dmjs.onrender.com/post/createpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create post');
      const { post } = await response.json();
  
      setPosts([post, ...posts]); // Add the new post to the beginning of the list
      setNewPost('');
      setNewPostImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <Navbar username={username} onLogout={onLogout} />
      <div className="forums-container p-4">
        <h1 className="text-xl font-bold mb-4">Forums</h1>

        {/* New Post Form */}
        <div className="new-post-form border p-4 rounded mb-6">
          <textarea
            className="w-full border p-2 rounded mb-2"
            placeholder="Write something..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="mb-2"
            onChange={(e) => setNewPostImage(e.target.files[0])}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCreatePost}
          >
            Post
          </button>
        </div>

        {/* Display Posts */}
        <div className="posts">
          {posts.map((post) => (
            <div key={post._id} className="post border p-4 rounded mb-4">
              <div className="post-header flex items-center mb-2">
                {/* <img
                  src={post.ProfilePicture}
                  alt={post.Username}
                  className="w-10 h-10 rounded-full mr-2"
                /> */}
                <h2 className="font-bold">{post.Username}</h2>
              </div>
              <p>{post.Content}</p>
              {post.PostUrl && (
                <img
                  src={post.PostUrl}
                  alt="Post"
                  className="mt-2 max-w-full rounded"
                />
              )}

              <div className="post-actions flex items-center mt-2">
                <button
                  className="text-blue-500 mr-4"
                  onClick={() => handleLike(post._id)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> Like ({post.Likes.length})
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDislike(post._id)}
                >
                  <FontAwesomeIcon icon={faThumbsDown} /> Dislike
                </button>
              </div>

              {/* Comments Section */}
              <div className="comments mt-4">
                <h3 className="font-bold mb-2">Comments</h3>
                {post.Comments.map((comment, index) => (
                  <div key={index} className="comment mb-2">
                    <p>
                      <strong>{comment.Username}:</strong> {comment.Comment}
                    </p>
                  </div>
                ))}
                <textarea
                  className="w-full border p-2 rounded mt-2"
                  placeholder="Add a comment..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(post._id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forums;
