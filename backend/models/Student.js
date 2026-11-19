const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name is too long']
        },
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            trim: true,
            unique: true,
            match: [/^\d+$/, 'Student ID must be a number']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^[0-9()+\-.\s]{7,20}$/, 'Phone number is not valid']
        },
        zip: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true,
            match: [/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits']
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
