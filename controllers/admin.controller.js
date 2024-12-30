const Badge = require('../models/badge.model');
const User = require('../models/user.model');


exports.getDashboard = (req, res) => {
    res.render('admin-dashboard', { username: req.session.user?.username, error: null });
};

exports.getBadges = async (req, res) => {
    const badges = await Badge.find().sort({ bitpoints_min: 1 });
    res.render('admin-badges', { badges , error: null });
};

exports.getBadgeEditForm = async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    if (!badge) return res.status(404).json({ error: 'Badge not found' });
    res.render('edit-badge', { badge });
};

exports.updateBadge = async (req, res) => {
    const { name, bitpoints_min, bitpoints_max, image_url } = req.body;
    try {
        await Badge.findByIdAndUpdate(req.params.id, { name, bitpoints_min, bitpoints_max, image_url });
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
    const users = await User.find({}, 'username admin');
    res.render('admin-users', { users });
};

exports.changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
};
