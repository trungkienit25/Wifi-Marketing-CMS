import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import brandRoutes from './routes/Brand.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/brands', brandRoutes);

// Database Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wifi_marketing';
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
