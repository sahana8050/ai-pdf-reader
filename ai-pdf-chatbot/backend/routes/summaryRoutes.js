import express from 'express';
import { handleQuickSummary, handleDetailedSummary, handleBulletNotes, handleInterviewQuestions } from '../controllers/summaryController.js';

const router = express.Router();

router.post('/quick', handleQuickSummary);
router.post('/detailed', handleDetailedSummary);
router.post('/bullet', handleBulletNotes);
router.post('/questions', handleInterviewQuestions);

export default router;
