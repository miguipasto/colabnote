import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

router.post('/createNote', notesController.createNote);
router.get('/get/:id', notesController.getNote);

router.post('/shareNote/:noteId', notesController.shareNote);
router.get('/getSharedNote/:orbitDBHash', notesController.getSharedNote);



export default router;
