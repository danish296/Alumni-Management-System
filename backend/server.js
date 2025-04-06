const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const alumniRoutes = require('./routes/alumni');
const crawlerRoutes = require('./routes/crawler');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Enhanced MongoDB Connection with improved error handling
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the app if connection fails
  }
}
connectToDatabase();

// Monitor MongoDB connection status
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting reconnection...');
  connectToDatabase();
});

mongoose.connection.on('connected', () => {
  console.log('Reconnected to MongoDB');
});

// API Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/crawler', crawlerRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Alumni Tracker API is running');
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
