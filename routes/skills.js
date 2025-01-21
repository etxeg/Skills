const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skill.controller');
const { isAuthenticated, isAuthenticatedAdmin } = require('../middlewares/auth.middleware');
const Skill = require('../models/skill.model'); // Import the Skill model

// Endpoints
router.get('/', isAuthenticated, skillsController.redirectToDefaultTree);
router.get('/:skillTreeName', isAuthenticated, skillsController.getSkills);
router.get('/:skillTreeName/add', isAuthenticatedAdmin, skillsController.getAddSkillForm);
router.post('/:skillTreeName/add', isAuthenticatedAdmin, skillsController.addSkill);
router.get('/:skillTreeName/view/:skillID', isAuthenticated, skillsController.getSkillDetails);
router.post('/:skillTreeName/:skillID/verify', isAuthenticated, skillsController.verifySkill);
router.post('/:skillTreeName/delete/:skillID', isAuthenticatedAdmin, skillsController.deleteSkill);
router.get('/:skillTreeName/edit/:skillID', isAuthenticatedAdmin, skillsController.getEditSkillForm);
router.post('/:skillTreeName/edit/:skillID', isAuthenticatedAdmin, skillsController.editSkill);
router.post('/:skillId/submitUserSkill', isAuthenticated, skillsController.submitUserSkill);

// API Endpoint: Fetch all skills
router.get('/api/skills', async (req, res) => {
    try {
        const skills = await Skill.find(); // Fetch all skills from the database
        res.json(skills); // Send skills as JSON response
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

module.exports = router;
