const express = require('express');
const router = express.Router();
const { isAuthenticatedAdmin } = require('../middlewares/auth.middleware.js');
const adminController = require('../controllers/admin.controller');

// Endpoints
router.get('/dashboard', isAuthenticatedAdmin, adminController.getDashboard);
router.get('/badges', isAuthenticatedAdmin, adminController.getBadges);
router.get('/badges/edit/:id', isAuthenticatedAdmin, adminController.getBadgeEditForm);
router.post('/badges/edit/:id', isAuthenticatedAdmin, adminController.updateBadge);
router.post('/badges/delete/:id', isAuthenticatedAdmin, adminController.deleteBadge);
router.get('/users', isAuthenticatedAdmin, adminController.getUsers);
router.post('/change-password', isAuthenticatedAdmin, adminController.changePassword);

module.exports = router;
