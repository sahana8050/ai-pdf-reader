import express from 'express';
import { listDocuments, deleteDocument } from '../controllers/documentController.js';

const router = express.Router();
router.get('/', listDocuments);
router.delete('/:id', deleteDocument);

export default router;
