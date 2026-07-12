require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { globalErrorHandler } = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const driverRoutes = require('./routes/driver.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
// TODO: Developer B - Import your routes here
// const tripRoutes = require('./routes/trip.routes');
// const maintenanceRoutes = require('./routes/maintenance.routes');
// const fuelRoutes = require('./routes/fuel.routes');
// const expenseRoutes = require('./routes/expense.routes');
// const reportRoutes = require('./routes/report.routes');

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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
app.use('/api/v1/dashboard', dashboardRoutes);

// TODO: Developer B - Mount your routes here
// app.use('/api/v1/trips', tripRoutes);
// app.use('/api/v1/maintenance', maintenanceRoutes);
// app.use('/api/v1/fuel', fuelRoutes);
// app.use('/api/v1/expenses', expenseRoutes);
// app.use('/api/v1/reports', reportRoutes);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
