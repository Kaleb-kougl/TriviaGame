const URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';
const gifURL = "https://api.giphy.com/v1/gifs/search?q="

let gifs = [];
let questionNumber = 0;
let dataJSON;
let countdownTimer;
let timeout;

// request gifs
$.ajax({
  url: gifURL + 'correct' + KEY,
  method: 'GET',
}).then(function(response){
  console.log(response.data);
  gifs.push(response.data);
})

$.ajax({
  url: gifURL + 'wrong' + KEY,
  method: 'GET',
}).then(function(response){
  console.log(response.data);
  gifs.push(response.data);
})
// Request trivia questions
$.ajax({
  url: URL,
  method: 'GET',
}).then(function(response){
  dataJSON = response;
  console.log(response);
  handleData(response);
})

function handleData(data=dataJSON, qNumber=questionNumber) {
  $('#gif').remove();
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

  const TIME_TOTAL = 10;
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
    alert('Correct');
    displayGif(true);
  } else {
    alert('Wrong');
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
    let imageUrl = gifs[0][0].images.original.url;
    image.attr('src', imageUrl);
    image.attr('alt', 'correct');
  } 
  else {
    let imageUrl = gifs[1][0].images.original.url;
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