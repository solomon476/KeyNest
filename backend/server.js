process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err.stack);
});
process.on('unhandledRejection', (reason, p) => {
    console.error('UNHANDLED REJECTION:', reason);
});

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');

// Import Routes
const mpesaRoutes = require('./routes/mpesaRoutes');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const unitRoutes = require('./routes/unitRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const leaseRoutes = require('./routes/leaseRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const meterRoutes = require('./routes/meterRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const caretakerRoutes = require('./routes/caretakerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authMiddleware = require('./middleware/authMiddleware');

// Routes
app.use('/api/mpesa', mpesaRoutes); // M-Pesa callback needs to be public
app.use('/api/auth', authRoutes); // Login/register are public

// Protected routes
app.use('/api/properties', authMiddleware, propertyRoutes);
app.use('/api/units', authMiddleware, unitRoutes);
app.use('/api/tenants', authMiddleware, tenantRoutes);
app.use('/api/leases', authMiddleware, leaseRoutes);
app.use('/api/maintenance', authMiddleware, maintenanceRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/meters', authMiddleware, meterRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/caretakers', authMiddleware, caretakerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'KeyNest Backend is running' });
});

// Debug: check which env vars are available (remove after debugging)
app.get('/api/debug-env', (req, res) => {
    res.status(200).json({
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        postgresUrlPrefix: process.env.POSTGRES_URL ? process.env.POSTGRES_URL.substring(0, 20) + '...' : 'NOT SET',
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT SET',
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
    });
});

// Export the app for Vercel Serverless Functions
module.exports = app;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Backend server started on port ${PORT}`);
    });
}
