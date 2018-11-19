const URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';
const gifURL = "https://api.giphy.com/v1/gifs/search?q="
const KEY = "&limit=10&api_key=dc6zaTOxFJmzC"
let gifs = [];
let questionNumber = 0;
let dataJSON;
let countdownTimer;
let timeout;
let correctCount = 0;
let incorrectCount = 0;
let unansweredCount = 0;

// request gifs
$.ajax({
  url: gifURL + 'correct' + KEY,
  method: 'GET',
}).then(function(response){
  gifs.push(response.data);
})

$.ajax({
  url: gifURL + 'wrong' + KEY,
  method: 'GET',
}).then(function(response){
  gifs.push(response.data);
})

// Request trivia questions
$.ajax({
  url: URL,
  method: 'GET',
}).then(function(response){
  dataJSON = response;
  handleStart();
})

function handleStart() {
  $('#question').on('click', function(){
    $('#question').html('Question');
    $('#time-div').css({'display': 'block'});
    $('#question').off('click');
    handleData();
  })
}

function handleData(data=dataJSON, qNumber=questionNumber) {
  $('#gif').remove();
  if (qNumber === 10) {
    handleEndOfGame();
    return;
  }
  $("#question").html(data.results[qNumber].question);


  let randomNum = Math.floor(Math.random() * 4)
  for (let i = 0; i < 4; i++) {
    let divRow = $('<div class="row answer-row">');
    let divCol = $('<div class="col-12 answer">');
    if (i === randomNum) {
      $(divCol).html(data.results[qNumber].correct_answer);
      $(divCol).attr('data-isCorrect', 'true');
      divRow.append(divCol);
      $('.card-body').append(divRow);
    } else {
      $(divCol).html(data.results[qNumber].incorrect_answers[((i + randomNum) % 3)]);
      $(divCol).attr('data-isCorrect', 'false');
      divRow.append(divCol);
      $('.card-body').append(divRow);
    }
  }

  $('#time-remaining').html(10);

  const TIME_TOTAL = 9;
  let timeElapsed = 0;
  countdownTimer = setInterval(function(){
    $('#time-remaining').html(TIME_TOTAL - timeElapsed);
    timeElapsed++;
    if (timeElapsed === 10) {
      stopTimerFunction();
    }
  }, 1000);

  timeOut = setTimeout(function(){
    displayGif(false);
    unansweredCount++;
  }, 10000)
}

function stopTimerFunction(timer) {
  clearInterval(timer);
}

function myStopFunction(time) {
  clearTimeout(time);
}

$(document).on('click', '.answer', function(){
  let value = $(this).attr('data-isCorrect');
  if (value === 'true') {
    correctCount++;
    displayGif(true);
  } else {
    incorrectCount++;
    displayGif(false);
  }
})

function displayGif(correct) {
  myStopFunction(timeOut);
  stopTimerFunction(countdownTimer);
  questionNumber++;
  let divRow = $('<div class="row">');
  let divCol = $('<div class="col-12">');
  $('.answer-row').remove();
  let image = $('<img>');
  if (correct === true) {
    let imageUrl = gifs[0][correctCount % 10].images.original.url;
    image.attr('src', imageUrl);
    image.attr('alt', 'correct');
  }
  else {
    let imageUrl = gifs[1][incorrectCount % 10].images.original.url;
    image.attr('src', imageUrl)
    image.attr('alt', 'wrong')
  }
  image.attr('id', 'gif')
  divCol.append(image);
  divRow.append(divCol);
  $('.card-body').append(divRow);
  setTimeout(function(){
    handleData()
  }, 3000)
}

function handleEndOfGame() {
  $("#question").html(`<h1>All done, here's how you did!</h1>`);
  let divRow = $('<div class="row end-of-game">');
  let divCol = $('<div class="col-12">');
  divCol.html(`Correct Answers ${correctCount}`);
  divRow.append(divCol);
  $('.card-body').append(divRow);

  let divr = $('<div class="row end-of-game">');
  let divc = $('<div class="col-12">');
  divc.html(`Incorrect Answers ${incorrectCount}`);
  divr.append(divc);
  $('.card-body').append(divr);

  let divur = $('<div class="row end-of-game">');
  let divuc = $('<div class="col-12">');
  divuc.html(`Unanswered ${unansweredCount}`);
  divur.append(divuc);
  $('.card-body').append(divur);

  let restartRow = $('<div class="row end-of-game">');
  let restartCol = $('<div class="col-12">');
  restartCol.html(`Restart`);
  restartRow.append(restartCol);
  restartRow.attr('id', 'restart');
  $('.card-body').append(restartRow);
}

$(document).on('click', '#restart', function(){
  $('#restart').off('click');
  $('#restart').remove();
  $('.answer-row').remove();
  $('.end-of-game').remove();
  questionNumber = 0;
  correctCount = 0;
  incorrectCount = 0;
  unansweredCount = 0;
  handleData();
})