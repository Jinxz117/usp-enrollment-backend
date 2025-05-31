const db = require('../Model/db'); // Correct path to your db.js
const { generateTranscriptPDF } = require('../utils/PDFGenerator');
const fs = require('fs');
const path = require('path');

const generateTranscript = async (req, res) => {
    const { studentId } = req.params;

    // Fetch student and program data
    const [studentRows] = await db.query(
        `SELECT s.id, s.first_name, s.last_name, p.program_name
         FROM students s
         JOIN programs p ON s.program_id = p.id
         WHERE s.id = ?`,
        [studentId]
    );

    if (!studentRows.length) return res.status(404).send("Student not found.");

    // Fetch grades and course info
    const [gradesRows] = await db.query(
        `SELECT g.year, g.semester, c.course_code, c.course_name, g.grade
         FROM grades g
         JOIN courses c ON g.course_id = c.id
         WHERE g.student_id = ?`,
        [studentId]
    );

    // Generate PDF
    const transcriptsDir = path.join(__dirname, '../transcripts');
    if (!fs.existsSync(transcriptsDir)) {
        fs.mkdirSync(transcriptsDir, { recursive: true });
    }

    const filePath = path.join(transcriptsDir, `transcript_${studentId}.pdf`);
    await generateTranscriptPDF(studentRows[0], gradesRows, filePath);

    res.download(filePath);
};

module.exports = { generateTranscript };
