var express = require('express');
var router = express.Router();

var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/answers/:answered', function(req, res) {

  let correctlyAnswered = JSON.parse(req.params.answered);
  let answersData = JSON.parse(fs.readFileSync('files/answers.json')).melodies;
  
  let answerKeys = answersData.map(obj => obj.id);
  console.log(answerKeys);

  let remainingKeys = answerKeys.filter(key => !correctlyAnswered.includes(key));
  
  console.log(remainingKeys);
  let randomRemainingKey = remainingKeys[Math.floor(Math.random()*remainingKeys.length)]
  console.log(randomRemainingKey);


  res.json(answersData.find(item => item.id === randomRemainingKey));
});

module.exports = router;