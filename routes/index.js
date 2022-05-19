var express = require('express');
var router = express.Router();

var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Notle' });
});


router.get('/answers/:guesses', function(req, res) {

  let guesses = JSON.parse(req.params.guesses).map(obj => obj.id);
  let answersData = JSON.parse(fs.readFileSync('files/answers.json')).melodies;
  let answerKeys = answersData.map(obj => obj.id);
  let remainingKeys = answerKeys.filter(key => !guesses.includes(key));
  let randomRemainingKey = remainingKeys[Math.floor(Math.random()*remainingKeys.length)]
  console.log(randomRemainingKey);
  if (randomRemainingKey > -1) {
    console.log(answersData.find(item => item.id === randomRemainingKey));
    res.json(answersData.find(item => item.id === randomRemainingKey));
  }
  else {
    res.json(false);
  }
});

module.exports = router;