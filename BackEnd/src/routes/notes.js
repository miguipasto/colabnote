const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.post('/create', notesController.createNote);
router.get('/get/:id', notesController.getNote);

module.exports = router;
