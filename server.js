import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// --- Updated CORS Configuration ---
const allowedOrigins = [process.env.FRONTEND_URL]; // Should be e.g. "https://joyful-belekoy-246da3.netlify.app"
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// --- End CORS Configuration ---

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Server listen
app.listen(port, () => {
  console.log(`✅ Server started on PORT: ${port}`);
  if (process.env.FRONTEND_URL) {
    console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL}`);
  } else {
    console.log('⚠ No FRONTEND_URL set — CORS open to all origins (*)');
  }
});
