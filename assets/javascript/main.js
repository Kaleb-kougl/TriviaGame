const URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';
const gifURL = "https://api.giphy.com/v1/gifs/search?q="

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
  // console.log(response.data);
  gifs.push(response.data);
})

$.ajax({
  url: gifURL + 'wrong' + KEY,
  method: 'GET',
}).then(function(response){
  // console.log(response.data);
  gifs.push(response.data);
})

// Request trivia questions
$.ajax({
  url: URL,
  method: 'GET',
}).then(function(response){
  dataJSON = response;
  // console.log(response);
  handleData(response);
})

function handleData(data=dataJSON, qNumber=questionNumber) {
  $('#gif').remove();
  if (qNumber === 10) {
    console.log('qnumber = 10');
    handleEndOfGame();
    return;
  }
  $("#question").html(data.results[qNumber].question);


  for (let i = 0; i < 4; i++) {
    let divRow = $('<div class="row answer-row">');
    let divCol = $('<div class="col-12 answer">');
    if (i === 0) {
      $(divCol).html(data.results[qNumber].correct_answer);
      $(divCol).attr('data-isCorrect', 'true');
      divRow.append(divCol);
      $('.card-body').append(divRow);
    } else {
      $(divCol).html(data.results[qNumber].incorrect_answers[i - 1]);
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
    console.log('this is want 1 u want');
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
  console.log(this);
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
  if (correct) {
    let imageUrl = gifs[0][correctCount - 1].images.original.url;
    image.attr('src', imageUrl);
    image.attr('alt', 'correct');
  }
  else {
    let imageUrl = gifs[1][incorrectCount - 1].images.original.url;
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
  let divRow = $('<div class="row">');
  let divCol = $('<div class="col-12">');
  divCol.html(`Correct Answers ${correctCount}`);
  divRow.append(divCol);
  $('.card-body').append(divRow);

  let divr = $('<div class="row">');
  let divc = $('<div class="col-12">');
  divc.html(`Incorrect Answers ${incorrectCount}`);
  divr.append(divc);
  $('.card-body').append(divr);

  let divur = $('<div class="row">');
  let divuc = $('<div class="col-12">');
  divuc.html(`Unanswered ${unansweredCount}`);
  divur.append(divuc);
  $('.card-body').append(divur);
}