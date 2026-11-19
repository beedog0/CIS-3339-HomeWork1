const express = require('express');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/students            -> all students
// GET /api/students?search=jo  -> search by name or student ID
router.get('/', async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    let filter = {};

    if (search) {
        const pattern = new RegExp(escapeRegex(search), 'i');
        filter = { $or: [{ name: pattern }, { studentId: search }] };
    }

    const students = await Student.find(filter).sort({ name: 1 });
    res.json(students);
});

router.get('/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
});

router.post('/', async (req, res) => {
    const { name, studentId, phone, zip } = req.body || {};

    if (!name || !studentId || !phone || !zip) {
        return res.status(400).json({ error: 'Name, student ID, phone, and ZIP code are all required' });
    }

    const existing = await Student.findOne({ studentId: String(studentId).trim() });
    if (existing) {
        return res.status(409).json({ error: `A student with ID ${studentId} already exists` });
    }

    const student = await Student.create({
        name: String(name),
        studentId: String(studentId),
        phone: String(phone),
        zip: String(zip)
    });
    res.status(201).json(student);
});

router.delete('/:id', async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    const result = await Enrollment.deleteMany({ student: student._id });
    res.json({ message: 'Student deleted', student, enrollmentsRemoved: result.deletedCount });
});

module.exports = router;
