import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import emailjs from 'emailjs-com';

function ContactForm({ onClose }) {
  const [isFormOpen, setIsFormOpen] = useState(true); // Assume the form is open by default
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('service_j5gcdzh', 'template_4dlxz4l', formData, 'aD-y-r2gIOWmwkYUI')
      .then((result) => {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setIsFormOpen(false); // Close the form after a short delay to show success message
          onClose(); // Call the onClose function passed as a prop
        }, 1000); // Delay in milliseconds
      }, (error) => {
        setStatus('Error sending message.');
      });
  };

  return (
    <div className={`relative ${isFormOpen ? 'block' : 'hidden'}`}>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Message
        </button>
        {status && <p className="text-green-600">{status}</p>}
      </form>
    </div>
  );
}

export default ContactForm;
