const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { connectDB } = require('./db');

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await connectDB();
    } catch (error) {
        console.error('Could not connect to MongoDB:', error.message);
        console.error('Make sure MongoDB is running locally and MONGODB_URI in backend/.env is correct.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();
