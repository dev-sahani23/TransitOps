import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { globalErrorHandler  } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import driverRoutes from './routes/driver.routes.js';
import tripRoutes from './routes/trip.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'TransitOps API is running' });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
