const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// Middleware
app.use(cors({
  origin: ["https://strugglermedia-fr6zk7gnj-nitish-giddes-projects.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Authorization", "Content-Type"], 
  credentials: true 
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);

// Default route for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
