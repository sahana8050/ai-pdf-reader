import express from 'express';
import { handleHistory } from '../controllers/historyController.js';

const router = express.Router();
router.get('/', handleHistory);

export default router;
