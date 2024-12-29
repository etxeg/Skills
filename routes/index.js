var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');

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
}


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
        
  let data = await getData(hexagonId);
  let text = data.text
  let icon = `/electronics/icons/icon${hexagonId}.svg`;
  
  console.log(data.text);
  res.render('skill', { 
    title: text,
    description: skillData.description,
    score: skillData.score, 
    tasks: skillData.tasks, 
    resources: skillData.resources,
    icon: icon

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

  let data = await getData(hexagonId);
  let text = data.text;
  let icon = `/electronics/icons/icon${hexagonId}.svg`;
  let description = null;
  let score = 1;
  let resources = null;
  let tasks = null;

  console.log(hexagonId);
  res.render('edit', { 
    skillId: hexagonId,
    title: text,
    description: description || skillData.description,
    score: score || skillData.score, 
    tasks: tasks || skillData.tasks, 
    resources: resources || skillData.resources,
    icon: icon
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
