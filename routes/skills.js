const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthenticatedAdmin } = require('../middleware/auth');
const skillsController = require('../controllers/skill.controller');

// Endpoints
router.get('/', isAuthenticated, skillsController.redirectToDefaultTree);
router.get('/:skillTreeName', isAuthenticated, skillsController.getSkills);
router.get('/:skillTreeName/add', isAuthenticatedAdmin, skillsController.getAddSkillForm);
router.post('/:skillTreeName/add', isAuthenticatedAdmin, skillsController.addSkill);
router.get('/:skillTreeName/view/:skillID', isAuthenticated, skillsController.getSkillDetails);
router.post('/:skillTreeName/:skillID/verify', isAuthenticated, skillsController.verifySkill);
router.post('/:skillTreeName/delete/:skillID', isAuthenticatedAdmin, skillsController.deleteSkill);

module.exports = router;
