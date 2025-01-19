const Badge = require('../models/badge.model');
const User = require('../models/user.model');


exports.getDashboard = (req, res) => {
    res.render('admin-dashboard', { username: req.session.user?.username, error: null });
};

exports.getBadges = async (req, res) => {
    const badges = await Badge.find().sort({ bitpoints_min: 1 });
    //console.log(badges);
    res.render('admin-badges', { badges , error: null });
};

exports.getBadgeEditForm = async (req, res) => {
    try {
        const badge = await Badge.findById(req.params.id);
        if (!badge) {
            return res.status(404).render('edit-badge', { badge: null, error: 'Badge not found' });
        }
        res.render('edit-badge', { badge, error: null });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).render('edit-badge', { badge: null, error: 'Error al cargar el formulario de edición.' });
    }
};

exports.updateBadge = async (req, res) => {
    const { rango, name, bitpoints_min, bitpoints_max, png } = req.body;
    try {
        await Badge.findByIdAndUpdate(req.params.id, { rango, name, bitpoints_min, bitpoints_max, png });
        res.redirect('/admin/badges');
    } catch (error) {
        res.status(500).json({ error: 'Failed to update badge' });
    }
};

exports.deleteBadge = async (req, res) => {
    try {
        await Badge.findByIdAndDelete(req.params.id);
        res.redirect('/admin/badges');
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete badge' });
    }
};

exports.getUsers = async (req, res) => {
    const users = await User.find({});
    res.render('admin-users', { users });
};

exports.changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        await User.findByIdAndUpdate(userId, newPassword);

    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
};

exports.editPassword = async (req, res) => {
  try {
    const username = req.params.username;

    // Busca al usuario por el username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('Usuario no encontrado.');
    }

    // Renderiza la vista de cambio de contraseña, pasando el usuario
    res.render('change-password', { user });
  } catch (error) {
    console.error('Error al cargar la página de cambio de contraseña:', error);
    res.status(500).send('Error al cargar la página.');
  }
};
