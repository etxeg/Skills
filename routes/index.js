var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const Skill = require('../models/skill.model');
const Icon = require('../models/icons.model');
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

router.get('/leaderboard', function(req, res, next) {
  res.render('leaderboard', { title: 'Leaderboard' });
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
  const hexagonId = req.params.id-1;

  const filePath = path.join(__dirname, '../public/scripts/data.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(499).send('Ezin izan da JSON fitxategia irakurri');
    }

    let skills = JSON.parse(data);
    //const index = skills.findIndex(skill => skill.id === hexagonId); //funtzio hau ez dago, aldatu

    skills[hexagonId] = {
      ...skills[hexagonId],
      text: req.body.text,
      description: req.body.description,
      tasks: req.body.tasks,
      resources: req.body.resources,
      score: req.body.score
    };

    fs.writeFile(filePath, JSON.stringify(skills, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al escribir el archivo JSON');
      } else {
        res.status(200).send({ succes: true, message: 'Skill editatua' });
      }
    });
  });
});

module.exports = router;
