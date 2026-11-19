const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const { requireDB, notFound, errorHandler } = require('./middleware/errorHandler');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

const app = express();
const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');

app.use(cors());
app.use(express.json());

// API
app.use('/api', requireDB);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api', notFound);

// Vue production build
app.use(express.static(DIST_DIR));

// send index.html for any other GET so refreshing a Vue Router page works
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }
    const indexFile = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(indexFile)) {
        return res
            .status(503)
            .send('Frontend build not found. Run "npm run build" first and restart the server.');
    }
    res.sendFile(indexFile);
});

app.use(errorHandler);

module.exports = app;
