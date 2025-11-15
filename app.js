const fs = require('fs');
const express = require('express');
const app = express();
const port = 3001;

// Ensure logs directory exists
const logsDir = '/usr/src/app/logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Enhanced logging function
function logToFile(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    const logFile = `${logsDir}/app.log`;
    
    fs.appendFile(logFile, logMessage, (err) => {
        if (err) {
            console.error('LOG ERROR:', err);
        }
    });
    
    // Also log to console for docker logs
    console.log(`[${level}] ${message}`);
}

// Request logging middleware
app.use((req, res, next) => {
    logToFile('INFO', `REQUEST: ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    logToFile('INFO', 'GET / - Hello World endpoint accessed');
    res.send('Hello World from my Docker API!');
});

app.get('/health', (req, res) => {
    logToFile('INFO', 'GET /health - Health check performed');
    res.json({ 
        status: 'OK', 
        timestamp: new Date(),
        service: 'Tractor Field Activity API'
    });
});

// Error handling
app.use((err, req, res, next) => {
    logToFile('ERROR', `Server error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
    logToFile('WARN', `404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    logToFile('INFO', `Server started successfully on port ${port}`);
    logToFile('INFO', 'Tractor Field Activity API is ready for operations');
});