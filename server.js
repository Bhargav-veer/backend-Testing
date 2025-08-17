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

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',  // Main frontend
  'http://localhost:5174',  // Admin panel
  'http://localhost:5175',  // Backup port if needed
  'http://localhost:3000',  // Common React port
  'http://localhost:4173',  // Vite preview port
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`❌ CORS blocked request from: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve static files from the "public" directory at the root URL
app.use('/', express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Server listen
app.listen(port, () => {
  console.log(`✅ Server started on PORT: ${port}`);
  console.log('✅ CORS enabled for origins:');
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
  if (process.env.FRONTEND_URL) {
    console.log(`✅ Primary frontend: ${process.env.FRONTEND_URL}`);
  } else {
    console.log('⚠ No FRONTEND_URL set in environment');
  }
});
