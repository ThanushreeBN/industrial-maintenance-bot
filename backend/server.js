const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Route files
const equipmentRoutes = require('./routes/equipmentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const chatRoutes = require('./routes/chatRoutes');
const safetyRoutes = require('./routes/safetyRoutes');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io for Real-Time Chat
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected for live chat:', socket.id);

  // When a user sends a live message
  socket.on('send_live_message', (data) => {
    // Broadcast to others
    socket.broadcast.emit('receive_live_message', data);

    // Auto-reply with relevant answers based on keywords
    const lowerMsg = data.text.toLowerCase();
    let replyText = `Hi ${data.senderName}, I'm reviewing your issue now. Could you provide a bit more detail?`;

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi') {
      replyText = `Hello ${data.senderName}! How can the live support team assist you today?`;
    } else if (lowerMsg.includes('pump') || lowerMsg.includes('pressure') || lowerMsg.includes('valve')) {
      replyText = `I see you're asking about pressure/pump issues. I'm pulling up the hydraulic schematics now. Is it the primary or secondary valve?`;
    } else if (lowerMsg.includes('motor') || lowerMsg.includes('vibration') || lowerMsg.includes('noise')) {
      replyText = `Motor vibrations or noise usually point to misalignment. Have you already checked the coupling? I can walk you through the diagnostic.`;
    } else if (lowerMsg.includes('power') || lowerMsg.includes('electrical') || lowerMsg.includes('voltage')) {
      replyText = `Electrical issues are critical. Please ensure LOTO (Lockout/Tagout) is active before proceeding. I'm checking the power logs on my end.`;
    } else if (lowerMsg.includes('schedule') || lowerMsg.includes('maintenance')) {
      replyText = `I can help with scheduling. The maintenance crew is available for the 3rd shift tonight. Does that time work for this equipment?`;
    } else if (lowerMsg.includes('temperature') || lowerMsg.includes('overheat') || lowerMsg.includes('hot')) {
      replyText = `Overheating is a serious alarm. I'm alerting the floor manager. Please throttle down the system immediately while we investigate.`;
    } else if (lowerMsg.includes('sensor') || lowerMsg.includes('reading')) {
      replyText = `Let me check the telemetry data for that sensor. Sometimes calibration drifts over time. Try a hard reset on the local panel first.`;
    }

    setTimeout(() => {
      socket.emit('receive_live_message', {
        text: replyText,
        senderName: 'Sarah (Live Agent)'
      });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(express.json());
app.use(cors());

// Mount routers
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/safety', safetyRoutes);

// Error Handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend server & Socket.io running (in-memory) on port ${PORT}`);
});