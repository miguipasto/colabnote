import express from 'express';
import * as apiController from '../controllers/api_controller.js'

const router = express.Router();

router.get('/getNotesSaved/', apiController.getNotesSaved);
router.get('/getNote/:id', apiController.getNote);

router.post('/createNote', apiController.createNote);
router.put('/updateNote/:id',apiController.updateNote)

router.get('/getSharedNote/orbitdb/:orbit_address/:id', apiController.getSharedNote);
router.post('/shareNote/:id', apiController.shareNote);

router.delete('/deleteNote/:id', apiController.deleteNote);

export default router;