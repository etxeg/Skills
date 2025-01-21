const express = require('express');
const router = express.Router();
const UserSkill = require('../models/userSkill.model'); // Adjust the path as needed

router.get('/api/user-skills', async (req, res) => {
    try {
        const userSkills = await UserSkill.find(); // Fetch all UserSkill data
        res.json(userSkills);
    } catch (error) {
        console.error('Error fetching user skills:', error);
        res.status(500).json({ error: 'Failed to fetch user skills' });
    }
});

// Example of a backend route to get user skills for a particular skill
router.get('/api/user-skills/:skillId', async (req, res) => {
    try {
        const skillId = req.params.skillId;

        // Fetch the user skills associated with the skill ID
        const userSkills = await UserSkill.find({ skill: skillId })

        res.json(userSkills);  // Send the list of user skills back to the client
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user skills', error });
    }
});


module.exports = router;
