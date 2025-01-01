import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://animania-backend-dmjs.onrender.com'); // Replace with your backend URL

const ChatBox = ({ username, friend, friendPic, userPic, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
        useEffect(() => {
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };
    
            window.addEventListener("resize", handleResize);
    
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }, []);

    useEffect(() => {
        // Fetch initial chat messages
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `https://animania-backend-dmjs.onrender.com/user/data/user/${username}/messages/${friend}`
                );
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Listen for incoming messages
        socket.on('receiveMessage', (messageData) => {
            if (
                (messageData.sender === friend && messageData.receiver === username) ||
                (messageData.sender === username && messageData.receiver === friend)
            ) {
                setMessages((prevMessages) => [...prevMessages, messageData]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [username, friend]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: username,
            receiver: friend,
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
            senderProfilePic: friendPic, // Use the passed friend picture
        };

        try {
            // Save the message to the backend
            await fetch(
                `https://animania-backend-dmjs.onrender.com/user/data/user/${username}/messages/${friend}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: messageData.content }),
                }
            );

            // Emit the message to the server
            socket.emit('sendMessage', messageData);

            // Clear input field
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className={`bg-gray-800 bg-opacity-80 rounded-lg shadow-lg max-w-3xl mx-auto mt-6 ${isMobile ? "p-2" : "p-6"}`}>
            {/* Header with flexbox to align items */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    {/* Friend's profile picture and username */}
                    <img
                        src={friendPic}
                        alt={`${friend}'s profile`}
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    <h2 className="text-2xl font-bold text-gray-100">{friend}</h2>
                </div>
                {/* Close button aligned to the right */}
                <button onClick={onClose} className="text-red-400 hover:text-red-300">
                    Close
                </button>
            </div>

            {/* Chat message area */}
            <div className="max-h-60 overflow-y-scroll border border-gray-500 p-4 rounded-lg mb-4 bg-gray-900">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}
                    >
                        <div className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}>
                            {/* Display profile picture on the left of the message */}
                            <img
                                src={msg.sender === username ? userPic : friendPic}
                                alt={`${msg.sender}'s profile`}
                                className="w-8 h-8 rounded-full mr-2" // Margin to the right of the image
                            />
                            <p
                                className={`p-2 rounded-lg ${
                                    msg.sender === username
                                        ? 'bg-blue-700 text-white'
                                        : 'bg-gray-600 text-gray-200'
                                }`}
                            >
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input area */}
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 border border-gray-500 p-2 rounded-lg text-gray-800"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
