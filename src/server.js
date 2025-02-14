require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("./app");
const User = require("./models/User");
const Chat = require("./models/Chat");
const Category = require("./models/Category");
const chatRoutes = require("./routes/chatRoutes");

const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET;

app.use("/chats", chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://strugglermedia-fr6zk7gnj-nitish-giddes-projects.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinCategory", async (categoryName) => {
    socket.join(categoryName);
    try {
      const category = await Category.findOne({ name: categoryName });
      if (!category) return;

      const messages = await Chat.find({ category: category._id }).sort({ createdAt: 1 }).lean();
      socket.emit("receiveMessages", messages);
    } catch (error) {}
  });

  socket.on("sendMessage", async ({ category, message, token }) => {
    if (!message || !message.text || !token) return;

    try {
      const decoded = jwt.verify(token.trim(), JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return;

      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) return;

      const existingMessage = await Chat.findOne({
        text: message.text,
        userId: user._id,
        category: categoryDoc._id,
      });
      if (existingMessage) return;

      const newMessage = new Chat({
        category: categoryDoc._id,
        userId: user._id,
        sender: user.name,
        text: message.text,
      });
      const savedMessage = await newMessage.save();

      socket.emit("receiveMessage", savedMessage);
      socket.broadcast.to(categoryDoc.name).emit("receiveMessage", savedMessage);
    } catch (error) {}
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, "0.0.0.0", () => {});
