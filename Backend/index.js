import express from "express";
import http from 'http';
import {Server} from 'socket.io';
import dotenv from "dotenv";
import fetch from "node-fetch";
import mongoose from "mongoose";
import UserRouter from "./Router/UserRouter.js";
import cors from "cors";
import AnimeRouter from "./Router/AnimeRouter.js";
import MangaRouter from "./Router/MangaRouter.js";
import CharRouter from "./Router/CharRouter.js";
import CharacRouter from "./Router/CharacRouter.js";
import AnimeReviewRouter from "./Router/AnimeReviewRouter.js"; // Ensure correct import path
import MangaReviewRouter from "./Router/MangaReviewRouter.js";
import GenRouter from "./Router/GenRouter.js";
import MangGenRouter from "./Router/MangGenRouter.js";
import PostRouter from "./Router/PostRouter.js";
import CommentRouter from "./Router/CommentRouter.js";
import NewsRouter from "./Router/NewsRouter.js";
import EmailRouter from "./Router/EmailRouter.js";
import TempUserRouter from "./Router/TempUserRouter.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: ["http://localhost:5173", "https://annmania.netlify.app"],
    methods: ["GET","POST"],
  },
});
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for new messages
  socket.on('sendMessage', (messageData) => {
      console.log('Message received:', messageData);

      // Broadcast the message to all connected clients
      io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 4001;
const URI = process.env.MongoDBURI;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("ERROR: ", error));

mongoose.connection.on('error', (error) => {
  console.error('MongoDB Connection Error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});


// Routes
app.use("/user", UserRouter);
app.use("/anime", AnimeRouter);
app.use("/manga", MangaRouter);
app.use("/char", CharRouter);
app.use("/charac", CharacRouter);
app.use("/review", AnimeReviewRouter);
app.use("/mangareview", MangaReviewRouter);
app.use("/genrouter",GenRouter);
app.use("/mangenrouter",MangGenRouter);
app.use("/post",PostRouter);
app.use("/comment",CommentRouter);
app.use("/news", NewsRouter);
app.use("/mail",EmailRouter);
app.use("/tempuser",TempUserRouter);
app.post("/generateMessage", async (req, res) => {
  try {
    const { prompt } = req.body;

    const cleanPrompt = `
You are MyAnimeList chatbot. Only answer questions about anime and manga.

User question: "${prompt}"

If this is about anime/manga, answer helpfully. If not, respond with: "I'm not able to answer these types of questions. Please ask me something related to anime or manga."
    `.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: cleanPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ text: data.candidates[0].content.parts[0].text.trim() });
    } else {
      res.json({ text: "Please ask me something about anime or manga!" });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/', (req,res) => {
    res.send("Welcome")
})

app.use((req,res) => {
  res.status(404).json({error: "Route not found"});
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
