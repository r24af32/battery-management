import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import batteryRoutes from './routes/batteryRoutes.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use('/api', batteryRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection failed:', err));
