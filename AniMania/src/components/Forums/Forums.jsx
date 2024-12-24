import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // For animations
import Loading from '../Loading/Loading';

const Forums = ({ username, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState({}); // State to manage visibility
  const [loadingComments, setLoadingComments] = useState({});  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null); // Track which post's comments are being shown
  
  // Open the modal for comments
  const openCommentsModal = (postId) => {
    setActivePostId(postId);
    setIsModalOpen(true);
    toggleCommentsVisibility(postId); // Fetch comments if not already loaded
  };
  
  // Close the modal
  const closeCommentsModal = () => {
    setIsModalOpen(false);
    setActivePostId(null);
  };  

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
        body: JSON.stringify({ Username: username }),
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

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPost && !newPostImage) {
      alert('Please add text or an image to create a post.');
      return;
    }

    let postImageUrl = null;

    // If there is an image, upload it to Cloudinary
    if (newPostImage) {
      const formData = new FormData();
      formData.append('file', newPostImage);
      formData.append('upload_preset', 'Profile_picture'); // Replace with your Cloudinary preset name
      formData.append('cloud_name', 'dshjyicig'); // Replace with your Cloudinary cloud name

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dshjyicig/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          postImageUrl = data.secure_url; // Cloudinary's hosted URL
        } else {
          throw new Error('Failed to upload image to Cloudinary');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const formDataToSend = {
      Username: username,
      Content: newPost,
      PostUrl: postImageUrl,
    };

    try {
      const response = await fetch('https://animania-backend-dmjs.onrender.com/post/createpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSend),
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
  const handleAddComment = async (postId) => {
    if (!newComment) {
      alert('Please write a comment before submitting');
      return;
    }

    try {
      const response = await fetch('https://animania-backend-dmjs.onrender.com/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          username,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: [data.comment, ...(prev[postId] || [])],
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleCommentsVisibility = async (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility
    }));

    if (!comments[postId]) {
      // Fetch comments only if they are not already loaded
      setLoadingComments((prev) => ({
        ...prev,
        [postId]: true, // Set loading state to true for this post
      }));

      try {
        const response = await fetch(`https://animania-backend-dmjs.onrender.com/comment/${postId}`);
        const data = await response.json();
        setComments((prev) => ({
          ...prev,
          [postId]: data,
        }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments((prev) => ({
          ...prev,
          [postId]: false, // Set loading state to false after fetching
        }));
      }
    }
  };  
  if(!posts) return <div><Loading message="AniMania Forums"/></div>
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white', position: 'relative' }}>
      {/* Background Overlay */}
      <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      opacity: 0.6,
      filter: isModalOpen ? 'blur(8px)' : 'none',
      zIndex: 0,
    }}></div>

      <Navbar username={username} onLogout={onLogout} />

      <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      position: 'relative',
      zIndex: isModalOpen ? 0 : 10,
    }}>
        {/* Title with animation */}
        <motion.h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(to right, #6EE7B7, #3B82F6)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Forums
        </motion.h1>

        {/* New Post Form */}
        <motion.div
          style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <textarea
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e0e0e0',
              marginBottom: '1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: '1rem',
              color: '#333',
              transition: 'all 0.3s ease',
            }}
            placeholder="Write something..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            style={{
              padding: '0.5rem',
              marginBottom: '1rem',
              color: '#3b82f6',
              transition: '0.3s',
            }}
            onChange={(e) => setNewPostImage(e.target.files[0])}
          />
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              width: '100%',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onClick={handleCreatePost}
          >
            Post
          </button>
        </motion.div>

        {/* Display Posts with Animation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
            <motion.div
              key={post._id}
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Post Header */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src="https://via.placeholder.com/40" // Replace with user profile picture URL
                  alt="User Avatar"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '1rem',
                  }}
                />
                <motion.h2
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    color: '#3b82f6',
                    transition: '0.3s',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {post.Username}
                </motion.h2>
              </div>

              {/* Post Content */}
              <p style={{ color: '#333', marginBottom: '1rem' }}>{post.Content}</p>
              {post.PostUrl && (
                <img
                  src={post.PostUrl}
                  alt="Post"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem',
                  }}
                />
              )}

              {/* Post Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  style={{
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onClick={() => handleLike(post._id)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span>{post.Likes.length}</span>
                </button>
                <button
                style={{
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
                onClick={() => openCommentsModal(post._id)}
              >
                <FontAwesomeIcon icon={faComment} />
              </button>                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    {/* Comments Modal */}
    {isModalOpen && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
        }}>
          <h2>Comments</h2>
          {loadingComments[activePostId] && <p>Loading comments...</p>}
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
            {comments[activePostId]?.map((comment) => (
              <div key={comment._id} style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <p><strong>{comment.username}</strong>: {comment.content}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              color: 'black',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #e0e0e0',
            }}
          />
          <button
            onClick={() => handleAddComment(activePostId)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            Add Comment
          </button>
          <button
            onClick={closeCommentsModal}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
            }}
          >
            Close
          </button>
        </div>
      </div>
    )}      
    </div>
  );
};

export default Forums;
