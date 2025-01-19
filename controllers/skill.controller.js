const Skill = require('../models/skill.model');
const UserSkill = require('../models/userSkill.model');
const User = require('../models/user.model');

exports.redirectToDefaultTree = (req, res) => {
    res.redirect('/skills/electronics');
};

exports.getSkills = async (req, res) => {
    skillTreeName = req.params.skillTreeName;
    const skills = await Skill.find({ set: skillTreeName });
    res.render('skills-list', { skills , error: null, skillTreeName });
};

exports.getEditSkillForm = (req, res) => {
    res.render('edit', { skillTreeName: req.params.SkillTreeName});
}

exports.editSkill = async (req, res) => {
    try {
        const skillId = req.params.id;
        await Skill.getSkillDetails(skillId);
        res.redirect(`/skill/edit/${skillId}`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit skill' });
    }
}

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
    const skill = await Skill.findOne({id: skillID});
    const userId = req.session.user.user?.username;
    console.log(skill);
    res.render('skill-details', { skill , error: null, userId });
};

exports.verifySkill = async (req, res) => {
    const { userSkillId, approved } = req.body;
    try {
        const userSkill = await UserSkill.findById(userSkillId);
        userSkill.verifications.push({ user: req.user._id, approved });
        userSkill.verified = userSkill.verifications.every(v => v.approved);
        await userSkill.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify skill' });
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
        const skill = await Skill.findById(req.params.skillID);
        if (!skill) {
            return res.status(404).send('Skill not found');
        }
        res.render('skill-edit', { skill, skillTreeName: req.params.skillTreeName });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.editSkill = async (req, res) => {
    const { text, description, tasks, resources, score, icon } = req.body;
    try {
        await Skill.findByIdAndUpdate(req.params.skillID, {
            text,
            description,
            tasks: tasks ? tasks.split(',') : [], // Assuming tasks are comma-separated
            resources: resources ? resources.split(',') : [], // Assuming resources are comma-separated
            score,
            icon,
        });
        res.redirect(`/skills/${req.params.skillTreeName}`);
    } catch (error) {
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
