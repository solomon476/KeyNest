const fs = require('fs');

const unitController = require('./controllers/unitController');
console.log('unitController.getUnits:', typeof unitController.getUnits);
console.log('unitController.createUnit:', typeof unitController.createUnit);
console.log('unitController.updateUnit:', typeof unitController.updateUnit);
console.log('unitController.deleteUnit:', typeof unitController.deleteUnit);

const tenantController = require('./controllers/tenantController');
console.log('tenantController.getTenants:', typeof tenantController.getTenants);
console.log('tenantController.createTenant:', typeof tenantController.createTenant);

const paymentController = require('./controllers/paymentController');
console.log('paymentController.getPayments:', typeof paymentController.getPayments);
console.log('paymentController.recordPayment:', typeof paymentController.recordPayment);

const propertyController = require('./controllers/propertyController');
console.log('propertyController.getProperties:', typeof propertyController.getProperties);
console.log('propertyController.getPropertyById:', typeof propertyController.getPropertyById);
console.log('propertyController.createProperty:', typeof propertyController.createProperty);
console.log('propertyController.updateProperty:', typeof propertyController.updateProperty);
console.log('propertyController.deleteProperty:', typeof propertyController.deleteProperty);

const mpesaController = require('./controllers/mpesaController');
console.log('mpesaController.generateAccessToken:', typeof mpesaController.generateAccessToken);
console.log('mpesaController.stkPush:', typeof mpesaController.stkPush);
console.log('mpesaController.callback:', typeof mpesaController.callback);

const maintenanceController = require('./controllers/maintenanceController');
console.log('maintenanceController.getRequests:', typeof maintenanceController.getRequests);
console.log('maintenanceController.createRequest:', typeof maintenanceController.createRequest);
console.log('maintenanceController.updateRequestStatus:', typeof maintenanceController.updateRequestStatus);

const leaseController = require('./controllers/leaseController');
console.log('leaseController.getLeases:', typeof leaseController.getLeases);
console.log('leaseController.getMyLease:', typeof leaseController.getMyLease);
console.log('leaseController.createLease:', typeof leaseController.createLease);

const dashboardController = require('./controllers/dashboardController');
console.log('dashboardController.getLandlordStats:', typeof dashboardController.getLandlordStats);
console.log('dashboardController.getTenantStats:', typeof dashboardController.getTenantStats);

const aiController = require('./controllers/aiController');
console.log('aiController.chat:', typeof aiController.chat);
