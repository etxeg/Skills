const Skill = require('../models/skill.model');
const UserSkill = require('../models/userSkill.model');
const User = require('../models/user.model');

exports.redirectToDefaultTree = (req, res) => {
    res.redirect('/skills/electronics');
};

exports.getSkills = async (req, res) => {
    skillTreeName = req.params.skillTreeName;
    const skills = await Skill.find({ set: skillTreeName });
    res.render('skills-list', { skills, error: null, skillTreeName });
};

exports.getAddSkillForm = (req, res) => {
    res.render('add-skill', { skillTreeName: req.params.skillTreeName });
};

exports.addSkill = async (req, res) => {
    const { text, description, tasks, resources, score, icon } = req.body;
    try {
        const lastSkill = await Skill.findOne().sort({ id: -1 }).exec();
        const nextId = lastSkill ? parseInt(lastSkill.id) + 1 : 1; // Start at 1 if no skills exist
        // Convert comma-separated strings into arrays
        const tasksArray = tasks ? tasks.split(',').map(task => task.trim()) : [];
        const resourcesArray = resources ? resources.split(',').map(resource => resource.trim()) : [];

        // Create a new skill
        await Skill.create({
            id: nextId,
            text,
            description,
            tasks: tasksArray,
            resources: resourcesArray,
            score,
            icon,
            set: req.params.skillTreeName
        });

        // Redirect to the skill tree page
        res.redirect(`/skills/${req.params.skillTreeName}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add skill' });
    }
};

exports.getSkillDetails = async (req, res) => {
    const skillID = req.params.skillID;
    const skill = await Skill.findOne({ id: skillID });
    const userId = req.session.user.user?.username;
    console.log(skill);
    const userSkills = await UserSkill.find({skill: skillID});
    res.render('skill-details', { skill, error: null, userId , userSkills});
};

exports.verifySkill = async (req, res) => {
    try {
        const { skillTreeName, skillID } = req.params;
        const { userSkillId } = req.body;

        // Perform verification logic (e.g., update database, mark skill as verified)
        await UserSkill.findByIdAndUpdate(userSkillId, { verified: true });

        // Respond with success and the redirect URL
        res.json({ success: true, redirectUrl: '/' }); // Redirect to homepage
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error verifying skill' });
    }
};


exports.deleteSkill = async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.skillID);
        res.redirect(`/skills/${req.params.skillTreeName}`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete skill' });
    }
};

exports.getEditSkillForm = async (req, res) => {
    try {
        // Search for the skill using the custom `id` field
        const skill = await Skill.findOne({ id: req.params.skillID });
        if (!skill) {
            return res.status(404).send('Skill not found');
        }
        res.render('skill-edit', { skill, skillTreeName: req.params.skillTreeName });
    } catch (error) {
        console.error('Error fetching skill for editing:', error);
        res.status(500).send('Server error');
    }
};


exports.editSkill = async (req, res) => {
    const { text, description, tasks, resources, score, icon } = req.body;
    try {
        // Update the skill using the custom `id` field
        await Skill.findOneAndUpdate(
            { id: req.params.skillID },
            {
                text,
                description,
                tasks: tasks ? tasks.split(',') : [], // Assuming tasks are comma-separated
                resources: resources ? resources.split(',') : [], // Assuming resources are comma-separated
                score,
                icon,
            }
        );
        res.redirect(`/`);
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).send('Failed to update skill');
    }
};


exports.submitUserSkill = async (req, res) => {
    try {
        const { userId, skillId, feedback } = req.body;

        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Create a new UserSkill object
        const newUserSkill = new UserSkill({
            user: userId,          // user ID (from the logged-in user)
            skill: skillId,        // skill ID (from the submitted form)
            completed: true,       // Mark the task as completed
            completedAt: new Date(), // Mark the completion date
            evidence: feedback,    // Store the feedback as evidence
            verified: false,       // Initially not verified
        });

        // Save the new UserSkill to the database
        await newUserSkill.save();

        res.status(201).json({ message: 'User skill saved successfully' });
    } catch (error) {
        console.error('Error creating UserSkill:', error);
        res.status(500).send('Error creating UserSkill');
    }
};
