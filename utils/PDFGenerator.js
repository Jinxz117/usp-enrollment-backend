const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateTranscriptPDF = async (student, grades, filePath) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Header Styling
    doc.fontSize(22).text("Student Transcript", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Student ID: ${student.id}`);
    doc.text(`Name: ${student.first_name} ${student.last_name}`);
    doc.text(`Program: ${student.program_name}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Grade Table Header
    doc.fontSize(16).text("Grade Information:");
    doc.fontSize(12);
    doc.text("----------------------------------------------------------");
    doc.text("Year  | Semester  | Course Code  | Course Name  | Grade");
    doc.text("----------------------------------------------------------");

    // Populate Grades
    grades.forEach(({ year, semester, course_code, course_name, grade }) => {
        doc.text(`${year}  | ${semester}  | ${course_code}  | ${course_name}  | ${grade}`);
    });

    doc.end();
    return filePath;
};

module.exports = { generateTranscriptPDF };
