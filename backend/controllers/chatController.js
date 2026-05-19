const { v4: uuidv4 } = require('uuid');

let chatHistory = [];

exports.getChatHistory = (req, res) => {
  res.status(200).json({ success: true, data: chatHistory });
};

exports.sendMessage = (req, res) => {
  const { message } = req.body;
  
  const userChat = {
    id: uuidv4(),
    message,
    sender: 'User',
    timestamp: new Date()
  };
  chatHistory.push(userChat);
  
  // Basic keyword matching for more contextual answers
  const lowerMsg = message.toLowerCase();
  let responseText = "I can help with that. Could you provide more details about the equipment you are asking about?";
  
  if (lowerMsg.includes('troubleshoot') || lowerMsg.includes('vibration') || lowerMsg.includes('error')) {
      responseText = "Based on common troubleshooting protocols, unusual vibrations or error codes indicate a need to check the pressure valves and motor alignment. Please stop the equipment immediately.";
  } else if (lowerMsg.includes('safety')) {
      responseText = "Safety First: Please refer to Section 4 of the safety manual. Ensure power is disconnected and lockout/tagout (LOTO) procedures are followed before any inspection.";
  } else if (lowerMsg.includes('maintenance') || lowerMsg.includes('schedule')) {
      responseText = "The recommended maintenance schedule involves a full lubrication and calibration every 300 operating hours. Would you like me to pull up the exact procedure?";
  } else if (lowerMsg.includes('temperature') || lowerMsg.includes('hot')) {
      responseText = "Warning: High temperature detected in logs. Please ensure the cooling systems are operational and the ambient temperature is within normal limits.";
  } else if (lowerMsg.includes('boiler')) {
      responseText = "For Boiler systems, check the pressure valve daily before startup and always wear protective thermal gear.";
  } else if (lowerMsg.includes('cnc')) {
      responseText = "CNC Machines require precise calibration. Have you noticed any tool wear or deviation in recent cuts?";
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      responseText = "Hello! I am your Industrial Maintenance Knowledge Bot. How can I assist you with your equipment today?";
  }
  
  const botChat = {
    id: uuidv4(),
    message: responseText,
    sender: 'Bot',
    timestamp: new Date()
  };
  chatHistory.push(botChat);
  
  res.status(201).json({ 
      success: true, 
      data: {
          userMessage: userChat,
          botResponse: botChat
      }
  });
};