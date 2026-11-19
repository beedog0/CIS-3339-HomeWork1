const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: [true, 'Course ID is required'],
            trim: true,
            uppercase: true,
            unique: true,
            maxlength: [20, 'Course ID is too long']
        },
        name: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
            maxlength: [150, 'Course name is too long']
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
