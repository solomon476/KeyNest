const express = require('express');
const app = express();

const wrapTryCatch = (name, requirePath) => {
    try {
        const route = require(requirePath);
        return route;
    } catch (err) {
        console.error(`Error loading ${name}:`, err);
        return null;
    }
};

const mpesaRoutes = wrapTryCatch('mpesaRoutes', './routes/mpesaRoutes');
const authRoutes = wrapTryCatch('authRoutes', './routes/authRoutes');
const propertyRoutes = wrapTryCatch('propertyRoutes', './routes/propertyRoutes');
const unitRoutes = wrapTryCatch('unitRoutes', './routes/unitRoutes');
const tenantRoutes = wrapTryCatch('tenantRoutes', './routes/tenantRoutes');
const leaseRoutes = wrapTryCatch('leaseRoutes', './routes/leaseRoutes');
const maintenanceRoutes = wrapTryCatch('maintenanceRoutes', './routes/maintenanceRoutes');
const paymentRoutes = wrapTryCatch('paymentRoutes', './routes/paymentRoutes');
const dashboardRoutes = wrapTryCatch('dashboardRoutes', './routes/dashboardRoutes');
const aiRoutes = wrapTryCatch('aiRoutes', './routes/aiRoutes');
const meterRoutes = wrapTryCatch('meterRoutes', './routes/meterRoutes');

const authMiddleware = require('./middleware/authMiddleware');

try { app.use('/api/mpesa', mpesaRoutes); } catch (e) { console.error('mpesa err', e) }
try { app.use('/api/auth', authRoutes); } catch (e) { console.error('auth err', e) }
try { app.use('/api/properties', authMiddleware, propertyRoutes); } catch (e) { console.error('property err', e) }
try { app.use('/api/units', authMiddleware, unitRoutes); } catch (e) { console.error('unit err', e) }
try { app.use('/api/tenants', authMiddleware, tenantRoutes); } catch (e) { console.error('tenant err', e) }
try { app.use('/api/leases', authMiddleware, leaseRoutes); } catch (e) { console.error('lease err', e) }
try { app.use('/api/maintenance', authMiddleware, maintenanceRoutes); } catch (e) { console.error('maintenance err', e) }
try { app.use('/api/payments', authMiddleware, paymentRoutes); } catch (e) { console.error('payment err', e) }
try { app.use('/api/dashboard', authMiddleware, dashboardRoutes); } catch (e) { console.error('dashboard err', e) }
try { app.use('/api/ai', authMiddleware, aiRoutes); } catch (e) { console.error('ai err', e) }
try { app.use('/api/meters', authMiddleware, meterRoutes); } catch (e) { console.error('meters err', e) }

console.log("Test finished!");
