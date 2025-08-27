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

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemInstruction = `
You are an AI assistant specialized in anime and manga. Your expertise is strictly limited to this area. 
Do not discuss any topics outside of anime and manga, including politics, entertainment, sports, or personal advice.

Analyze the following request: "${prompt}"

If the request is about anime, manga, characters, storylines, ratings, recommendations, airing schedules, reviews, or related topics, provide a detailed and helpful answer.
If the request is not about anime or manga, simply reply with: "I'm not able to answer these types of questions. Please ask me something related to anime or manga."

Do not attempt to answer off-topic questions. Be polite and concise in your responses.
    `.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemInstruction }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            topP: 0.8,
            topK: 40
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the response text
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const generatedText = data.candidates[0].content.parts[0].text;
      res.json({ text: generatedText.trim() });
    } else {
      console.error("Unexpected response structure:", data);
      res.json({ text: "I'm sorry, I couldn't process your question. Please try again." });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ 
      error: "Something went wrong",
      message: error.message 
    });
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
