const express = require('express');
const router = express.Router();
const { isAuthenticatedAdmin } = require('../middlewares/auth.middleware.js');
const adminController = require('../controllers/admin.controller');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Endpoints
router.get('/dashboard', isAuthenticatedAdmin, adminController.getDashboard);
router.get('/badges', isAuthenticatedAdmin, adminController.getBadges);
router.get('/badges/edit/:id', isAuthenticatedAdmin, adminController.getBadgeEditForm);
router.post('/badges/edit/:id', isAuthenticatedAdmin, adminController.updateBadge);
router.post('/badges/delete/:id', isAuthenticatedAdmin, adminController.deleteBadge);
router.get('/users', isAuthenticatedAdmin, adminController.getUsers);
router.get('/users/:username/change-password', isAuthenticatedAdmin, adminController.editPassword);
router.post('/change-password', isAuthenticatedAdmin, async (req, res) => {
    try {
      const { userId, password } = req.body;
  
      if (!password || !userId) {
        return res.status(400).send('Datos incompletos.');
      }
  
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Actualizar la contraseña del usuario
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
  
      res.redirect('/admin/users'); // Redirige de vuelta a la lista de usuarios
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      res.status(500).send('Error al cambiar la contraseña.');
    }
  });
  

module.exports = router;
