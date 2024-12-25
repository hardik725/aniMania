// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const VerificationPage = () => {
//   const [email, setEmail] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const navigate = useNavigate();

//   const handleVerification = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("https://animania-backend-dmjs.onrender.com/tempuser/verify", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ Email : email, VerificationCode: verificationCode }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('User Verified:', data);
//         toast.success('Verification successful! You can now log in.', { position: 'top-center' });
//         navigate('/');
//       } else {
//         const errorData = await response.json();
//         toast.error(`Error: ${errorData.message}`, { position: 'top-center' });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('An error occurred during verification.', { position: 'top-center' });
//     }
//   };

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
//       style={{
//         backgroundImage: "url('https://i.postimg.cc/Y2b7D1jx/wp5203548-all-the-animes-wallpapers.jpg')",
//       }}
//     >
//       {/* Dark Overlay */}
//       <div
//         className="absolute inset-0 bg-black bg-opacity-60 z-0"
//         style={{ backdropFilter: 'blur(5px)' }}
//       ></div>

//       {/* Verification Box */}
//       <div
//         className="relative z-10 w-11/12 max-w-sm p-6 shadow-2xl rounded-xl bg-gradient-to-b from-purple-500 to-blue-600 text-white sm:w-full sm:max-w-md sm:p-8 md:max-w-md lg:max-w-lg animate-float"
//       >
//         <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">Verify Your Account</h2>
//         <form onSubmit={handleVerification}>
//           <div className="mb-4">
//             <label
//               className="block text-sm font-medium mb-2"
//               htmlFor="email"
//             >
//               Email:
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="mb-6">
//             <label
//               className="block text-sm font-medium mb-2"
//               htmlFor="verificationCode"
//             >
//               Verification Code:
//             </label>
//             <input
//               type="text"
//               id="verificationCode"
//               value={verificationCode}
//               onChange={(e) => setVerificationCode(e.target.value)}
//               required
//               className="w-full px-4 py-2 bg-white bg-opacity-20 border border-transparent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
//               placeholder="Enter the code you received"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 px-4 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
//           >
//             Verify
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VerificationPage;
