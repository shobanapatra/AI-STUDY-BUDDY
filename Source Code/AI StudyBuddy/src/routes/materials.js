const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadMaterial,
  getUserMaterials,
  getMaterial,
  getSummary,
  getFlashcards,
  getQuiz,
  getStudyPlan
} = require('../controllers/materialController');

// All routes are protected by auth middleware
router.post('/upload', auth, upload.single('file'), uploadMaterial);
router.get('/', auth, getUserMaterials);
router.post('/:id/summary', auth, getSummary);
router.post('/:id/flashcards', auth, getFlashcards);
router.post('/:id/quiz', auth, getQuiz);
router.post('/:id/studyplan', auth, getStudyPlan);
router.get('/:id', auth, getMaterial);
module.exports = router;