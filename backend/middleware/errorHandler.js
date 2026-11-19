const { isConnected } = require('../db');

function requireDB(req, res, next) {
    if (!isConnected()) {
        return res.status(503).json({ error: 'Database is not available. Please try again later.' });
    }
    next();
}

function notFound(req, res) {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: messages.join('. ') });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid id' });
    }

    if (err.code === 11000) {
        return res.status(409).json({ error: 'That record already exists' });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Request body is not valid JSON' });
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = { requireDB, notFound, errorHandler };
