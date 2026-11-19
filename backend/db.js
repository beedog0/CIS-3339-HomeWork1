const mongoose = require('mongoose');

const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not set. Check backend/.env');
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    // makes sure the collections and unique indexes exist on a fresh database
    await Promise.all([Student.init(), Course.init(), Enrollment.init()]);

    console.log(`Connected to MongoDB (${mongoose.connection.name})`);
}

function isConnected() {
    return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isConnected };
