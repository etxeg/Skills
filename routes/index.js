var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const Skill = require('../models/skill.model');
const Icon = require('../models/icons.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', isLoggedIn: req.session.user ? true : false, user: req.session.user||null });
});

const skillData = {
  description : "lorem ipsum dolor sit amet consectetur adipiscing elit",
  score : 1,
  tasks : [
    "task 1",
    "task 2",
    "task 3",
    "task 4",
  ],
  resources : [
    "resource 1",
    "resource 2",
    "resource 3",
    "resource 4",
  ]
};


async function getData(id) {
  let response = await fetch('http://skills.etxeg.live/scripts/data.json');
  if (!response.ok) throw new Error('Error al cargar el JSON');
  let data = await response.json();
  //console.log(data);
  let item = data.find(item => item.id === id); 
  console.log("item",item);

  return item
}

// create a new get endpoint for /skill/:id
router.get('/skill/:id', async function(req, res, next) {
  const hexagonId = req.params.id;

  const skill = await Skill.findOne({ id: hexagonId });

  res.render('skill', { 
    title: skill.text,
    description: skill.description || skillData.description,
    score: skill.score || skillData.score, 
    tasks: skill.tasks || skillData.tasks, 
    resources: skill.resources || skillData.resources,
    icon: skill.icon

  });
});

router.get('/leaderboard', async function(req, res, next) {
  
  const users = await User.find({});

  res.render('leaderboard', { 
    title: 'Leaderboard',
    users:  users
  });
}); 

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

// Edit aukera
router.get('/skill/edit/:id', async function(req, res, next) {
  const hexagonId = req.params.id;

  const skill = await Skill.findOne({ id: hexagonId });
  const icon = await Icon.findOne({ id: hexagonId});

  res.render('edit', { 
    skillId: skill.id,
    title: skill.text,
    description: skill.description || skillData.description,
    score: skill.score || skillData.score, 
    tasks: skill.tasks || skillData.tasks, 
    resources: skill.resources || skillData.resources,
    icon: skill.icon
  });
});

router.delete('/skill/:id', (req, res) => {
  const hexagonId = req.params.id;

  const filePath = path.join(__dirname, '../public/scripts/data.json'); // JSON route
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(499).send('Ezin izan da JSON fitxategia irakurri');
    }

    let skills = JSON.parse(data);
    skills = skills.filter(skill => parseInt(skill.id) !== parseInt(hexagonId)); // Beharrezko skill filtratu
    fs.writeFile(filePath, JSON.stringify(skills, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al escribir el archivo JSON');
      }

      res.status(200).send({ success: true, message: 'Skill ezabatua' });
    });
  });
});

router.put('/skill/:id', async (req, res) => {
  try {
    const hexagonId = req.params.id;

    const tasks = req.body.tasks.filter(task => task.trim() !== '');
    const resources = req.body.resources.filter(resource => resource.trim() !== '');

    const updatedSkill = await Skill.findOneAndUpdate(
      { id: hexagonId },
      {
        text: req.body.text,
        description: req.body.description,
        tasks: tasks,
        resources: resources,
        score: req.body.score
      },
      { new: true }
    );

    if (!updatedSkill) {
      return res.status(404).send({ success: false, message: 'Skill no encontrado' });
    }

      res.status(200).send({ success: true, message: 'Skill actualizado correctamente', skill: updatedSkill });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error al actualizar el skill', error });
  }
});

module.exports = router;
