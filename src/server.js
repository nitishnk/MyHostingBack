const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { PORT } = require("./config/dotenv");

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// Store messages for each category (room)
const categoryMessages = {};

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // When a user joins a category
  socket.on("joinCategory", (category) => {
    socket.join(category); // Join the category (room)
    
    console.log(`🔹 User ${socket.id} joined category: ${category}`);

    // Send previous messages one by one
    if (categoryMessages[category]) {
      categoryMessages[category].forEach((msg) => {
        socket.emit("receiveMessage", msg);
      });
    }
  });

  // Handle sending a message
  socket.on("sendMessage", ({ category, message }) => {
    if (!categoryMessages[category]) {
      categoryMessages[category] = [];
    }
    
    categoryMessages[category].push(message);

    // Broadcast message to everyone in the category room
    io.to(category).emit("receiveMessage", message);
    
    console.log(
      `📩 Message from ${message.sender || "Anonymous"} in ${category}: "${message.text}"`
    );
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
