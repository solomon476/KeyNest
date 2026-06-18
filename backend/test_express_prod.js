process.env.NODE_ENV = 'production';

try {
    const app = require('./server.js');
    console.log("server.js loaded successfully");
} catch (err) {
    console.error("Error loading server.js:");
    console.error(err.stack);
}
