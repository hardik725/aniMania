import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // For animations
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Forums = ({ username, onLogout }) => {
  const [userphoto, setuserphoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState({}); // State to manage visibility
  const [loadingComments, setLoadingComments] = useState({});  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null); // Track which post's comments are being shown
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  }
  
  useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);    
  
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

  // Fetch all posts and user Photo from the server

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
    const fetchuserPhoto = async() => {
      try{
        const response = await fetch(`https://animania-backend-dmjs.onrender.com/user/Userdata/${username}`);
        if(!response.ok) throw new Error('Failed to fetch userdata');
        const data = await response.json();
        setuserphoto(data.ProfilePicture);
      } catch(error){
        console.error('Error fetching User Photo, error');
      }
    };
    fetchPosts();
    fetchuserPhoto();
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
      UserPhoto: userphoto,
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
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      opacity: 0,
      filter: isModalOpen ? 'blur(8px)' : 'none',
      zIndex: 0,
    }}
  ></div>

  <Navbar username={username} onLogout={onLogout} />

  <div className='bg-slate-800'
  style={{
     // Soft gradient background
    minHeight: '100vh', // Full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    boxSizing: 'border-box',
  }}
>
  <div
    style={{
      maxWidth: '800px',
      width: '100%',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: 'black',
      borderRadius: '1rem',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    }}
  >
    {/* Title with Animation */}
    <motion.h1
      style={{
        fontSize: '2.5rem',
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
        marginBottom: '2rem',
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
          border: '1px solid #ddd',
          marginBottom: '1rem',
          fontSize: '1rem',
          resize: 'none',
        }}
        placeholder="What's on your mind?"
      />
      <input
        type="file"
        accept="image/*"
        style={{
          display: 'block',
          marginBottom: '1rem',
        }}
      />
      <button
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
      >
        Post
      </button>
    </motion.div>

    {/* Display Posts */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
  {posts.map((post) => (
    <motion.div
      key={post._id}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Post Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img
          src={post.UserPhoto || 'https://via.placeholder.com/40'}
          alt="User"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid #3b82f6',
            marginRight: '1rem',
          }}
        />
        <motion.h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#3b82f6',
          }}
          whileHover={{ scale: 1.1, color: '#2563eb' }}
        >
          <Link
            to={
              post.Username === username
                ? '/profile'
                : `/friendprofile/${post.Username}`
            }
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {post.Username}
          </Link>
        </motion.h2>
      </div>

      {/* Post Content */}
      <p
        style={{
          marginBottom: '1rem',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#555',
        }}
      >
        {post.Content}
      </p>
      {post.PostUrl && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1rem',
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        >
          <img
            src={post.PostUrl}
            alt="Post"
            style={{
              width: '100%',
              maxHeight: isMobile ? '200px' : '400px',
              objectFit: 'cover',
              borderRadius: '0.5rem',
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '1.5rem',
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#3b82f6',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          onClick={() => handleLike(post._id)}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          {post.Likes.length}
        </button>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#3b82f6',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
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
</div>


  {/* Comments Modal */}
  {isModalOpen && (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2>Comments</h2>
        {loadingComments[activePostId] && <p>Loading comments...</p>}
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
          {comments[activePostId]?.map((comment) => (
            <div key={comment._id} style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <p className='text-black'>
                <strong>{comment.username}</strong>: {comment.content}
              </p>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment} // Controlled component
          onChange={handleInputChange} // Update state on input change          
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            marginBottom: '1rem',
            color: 'black'
          }}
        />
        <button
          onClick={() => handleAddComment(activePostId)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginRight: '0.5rem',
          }}
        >
          Add Comment
        </button>
        <button
          onClick={closeCommentsModal}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )}
  <Footer/>
</div>

  );
};

export default Forums;
