var express = require('express');
var router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, 'public')));


const isAuthenticated = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', isLoggedIn: isAuthenticated });
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
  console.log(data);
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

router.get('/skill/edit/:id', async function(req, res, next) {
  const hexagonId = req.params.id;

  let data = await getData(hexagonId);
  let text = data.text
  let icon = `/electronics/icons/icon${hexagonId}.svg`;

  console.log(data.text);
  res.render('edit', { 
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

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

module.exports = router;
