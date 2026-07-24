const express = require('express');
const router = express.Router();
const {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  seedDatabase,
  aiGeneratePage
} = require('../controllers/pageController');
const protectRoute = require('../middleware/authMiddleware');

// Public routes
router.get('/pages', getPages);
router.get('/pages/:slug', getPageBySlug);
router.post('/seed', seedDatabase);

// Admin-only protected routes
router.post('/ai-generate', protectRoute, aiGeneratePage);
router.post('/pages', protectRoute, createPage);
router.put('/pages/:id', protectRoute, updatePage);
router.delete('/pages/:id', protectRoute, deletePage);

module.exports = router;
