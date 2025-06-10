const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRouter');
const cors = require('cors');
const archiveRoutes = require('./routes/archiveRoutes');
const documentRoutes = require('./routes/documentRouter');
// const seedForfaits = require('./seeds/forfaitSeed');
const supportRoutes = require('./routes/supportRoutes');
const forfaitRoutes = require('./routes/forfaitRouter');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD 
    : process.env.FRONTEND_URL_DEV,
  credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
// .then(() => seedForfaits()) // Seed forfaits after connection
.catch(err => console.error('MongoDB connection error:', err));  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/documents', documentRoutes);
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads/documents')));
app.use('/api/support', supportRoutes);
app.use('/api/forfaits', forfaitRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});  
