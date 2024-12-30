const Skill = require('../models/skill.model');
const UserSkill = require('../models/userSkill.model');

exports.redirectToDefaultTree = (req, res) => {
    res.redirect('/skills/electronics');
};

exports.getSkills = async (req, res) => {
    skillTreeName = req.params.skillTreeName;
    const skills = await Skill.find({ set: skillTreeName });
    console.log(skills);
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
        // Convert comma-separated strings into arrays
        const tasksArray = tasks ? tasks.split(',').map(task => task.trim()) : [];
        const resourcesArray = resources ? resources.split(',').map(resource => resource.trim()) : [];

        // Create a new skill
        await Skill.create({ 
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
    const skill = await Skill.findById(req.params.hexagonId);
    res.render('skill-details', { skill , error: null });
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