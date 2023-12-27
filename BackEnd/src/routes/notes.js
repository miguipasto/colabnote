import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

router.post('/createNote', notesController.createNote);
router.get('/getNote/:id', notesController.getNote);

router.post('/shareNote/:id', notesController.shareNote);
router.get('/getSharedNote/orbitdb/:dbAddress/:noteId', notesController.getSharedNote);



export default router;