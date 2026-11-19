const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

router.get('/', async (req, res) => {
    const courses = await Course.find().sort({ courseId: 1 });
    res.json(courses);
});

router.post('/', async (req, res) => {
    const { courseId, name } = req.body || {};

    if (!courseId || !name) {
        return res.status(400).json({ error: 'Course ID and course name are required' });
    }

    const normalizedId = String(courseId).trim().toUpperCase();
    const existing = await Course.findOne({ courseId: normalizedId });
    if (existing) {
        return res.status(409).json({ error: `Course ${normalizedId} already exists` });
    }

    const course = await Course.create({ courseId: normalizedId, name: String(name) });
    res.status(201).json(course);
});

router.delete('/:id', async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const result = await Enrollment.deleteMany({ course: course._id });
    res.json({ message: 'Course deleted', course, enrollmentsRemoved: result.deletedCount });
});

// roster for one course
router.get('/:id/students', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const enrollments = await Enrollment.find({ course: course._id }).populate('student');
    const students = enrollments
        .filter((e) => e.student)
        .map((e) => e.student)
        .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ course, students });
});

module.exports = router;
