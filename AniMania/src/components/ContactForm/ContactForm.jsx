import React, { useState } from 'react';

function ContactForm({ onClose }) {
  const [isFormOpen, setIsFormOpen] = useState(true); // Assume the form is open by default
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    fetch('https://animania-backend-dmjs.onrender.com/mail/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: formData.email,
        Message: formData.message,
        Username: formData.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.message);
      })
      .catch(() => setStatus('Error sending message. Please try later.'));
  };

  return (
    <div
      className={`fixed z-50 inset-x-0 mx-auto transition-transform duration-300 ${
        isFormOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      } w-11/12 max-w-md bg-white shadow-lg rounded-lg p-6`}
      style={{ bottom: '15%', maxHeight: '80vh', overflowY: 'auto' }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Your Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Send Message
        </button>
        {status && <p className="text-green-600 mt-2">{status}</p>}
      </form>
    </div>
  );
}

export default ContactForm;
