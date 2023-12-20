import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

router.post('/createNote', notesController.createNote);
router.get('/get/:id', notesController.getNote);

export default router;
