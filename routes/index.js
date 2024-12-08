var express = require('express');
var router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
  let response = await fetch('http://skill.etxeg.live/scripts/data.json');
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

module.exports = router;
