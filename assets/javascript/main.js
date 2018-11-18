const URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';

// let dataJSON;

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
  $('#answer2').html(data.results[0].incorrect_answers[0]);
  $('#answer3').html(data.results[0].incorrect_answers[1]);
  $('#answer4').html(data.results[0].incorrect_answers[2]);
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
})