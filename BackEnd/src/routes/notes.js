import express from 'express';
import * as apiController from '../controllers/api_controller.js'

const router = express.Router();

router.post('/createNote', apiController.createNote);
router.get('/getNote/:id', apiController.getNote);
router.post('/updateNote/:id',apiController.updateNote)

router.post('/shareNote/:id', apiController.shareNote);
router.get('/getSharedNote/orbitdb/:orbit_address/:id', apiController.getSharedNote);

export default router;