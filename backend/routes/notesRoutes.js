import express from 'express';
import { handleNoteCreate, handleGetNotes } from '../controllers/notesController.js';

const router = express.Router();
router.post('/', handleNoteCreate);
router.get('/:documentId', handleGetNotes);

export default router;
