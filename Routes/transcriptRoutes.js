const express = require('express');
const { generateTranscript } = require('../Controllers/transcriptController');
const router = express.Router();

router.get('/generate-transcript/:studentId', generateTranscript);

module.exports = router;
