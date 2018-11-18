const URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';
let gifURL = "https://api.giphy.com/v1/gifs/search?q="
const KEY = "&limit=10&api_key=dc6zaTOxFJmzC"

let gifs = [];

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
  // dataJSON = response;
  console.log(response);
  handleData(response);
})

function handleData(data) {
  $("#question").html(data.results[0].question);
  $('#answer1').html(data.results[0].correct_answer);
  $('#answer1').attr('data-isCorrect', 'true');
  $('#answer2').html(data.results[0].incorrect_answers[0]);
  $('#answer2').attr('data-isCorrect', 'false');
  $('#answer3').html(data.results[0].incorrect_answers[1]);
  $('#answer3').attr('data-isCorrect', 'false');
  $('#answer4').html(data.results[0].incorrect_answers[2]);
  $('#answer4').attr('data-isCorrect', 'false');
  const TIME_TOTAL = 10;
  let timeElapsed = 0;
  let countdownTimer = setInterval(function(){
    $('#time-remaining').html(TIME_TOTAL - timeElapsed);
    timeElapsed++;
    if (timeElapsed === 10) {
      stopTimerFunction();
    }
  }, 1000);

  function stopTimerFunction() {
    clearInterval(countdownTimer);
  }
}

$('.answer').on('click', function(){
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
  divCol.append(image);
  divRow.append(divCol);
  $('.card-body').append(divRow);
}