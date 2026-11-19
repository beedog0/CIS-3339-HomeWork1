const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

router.get('/', async (req, res) => {
    const enrollments = await Enrollment.find().populate('student').populate('course');
    res.json(enrollments);
});

router.post('/', async (req, res) => {
    const { studentId, courseId } = req.body || {};

    if (!studentId || !courseId) {
        return res.status(400).json({ error: 'A student and a course must be selected' });
    }
    if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({ error: 'Invalid student or course' });
    }

    const [student, course] = await Promise.all([
        Student.findById(studentId),
        Course.findById(courseId)
    ]);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const existing = await Enrollment.findOne({ student: student._id, course: course._id });
    if (existing) {
        return res.status(409).json({ error: `${student.name} is already enrolled in ${course.courseId}` });
    }

    const enrollment = await Enrollment.create({ student: student._id, course: course._id });
    res.status(201).json({ _id: enrollment._id, student, course });
});

router.delete('/:id', async (req, res) => {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment removed' });
});

module.exports = router;
