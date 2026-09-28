const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/utils/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('AI StudyBuddy API is running...');
});

// Import and use routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/materials', require('./src/routes/materials'));
app.use('/api/admin', require('./src/routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});