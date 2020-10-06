var questions = [{
    question: "Commonly used data types DO NOT include:",
    choices: ["strings", "booleans", "alerts", "numbers"],
    answer: "alerts",
  },
  {
    question: "The condition in an if / else statement is enclosed within ____.",
    choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
    answer: "parentheses",
  },
];

var questionNumEl = document.querySelector("#questionNum");
var questionEl = document.querySelector("#question");
var optionListEl = document.querySelector("#option-list");
var questionResultEl = document.querySelector("#question-result");
var timerEl = document.querySelector("#timer");

var questionIndex = 0; // for accessing the current object by index in array above
var correctCount = 0; // for incrementing when an answer is correct
var time = 10; // holds length of game
var intervalId; // holds return of the setInterval ID
//_____________________________________________________________________________
function endQuiz() { //step 4- ends the quiz and calls show high score
  clearInterval(intervalId); // stops the timer
  var body = document.body; // easier way of writing document.body
  body.innerHTML = "Game over, You scored " + correctCount; // clears the body and updates DOM to indicate game is over
  setTimeout(showHighScore, 2); // wait 2 seconds then call function to render high score page
}
//_____________________________________________________________________________
function showHighScore() { // step 5 clear page and show high score
  var name = prompt("Please enter your name"); //ask user to enter their name
  //validation?

  var high_scores = localStorage.getItem("scores"); //check to see if any scores in array...

  if (!high_scores) { // ...if no scores in array...
    high_scores = []; // ... initialize array ...
  } else {
    high_scores = JSON.parse(high_scores); // ... or parse the high scores that exist, 
    // which exist as strings and need to be converted back to object/array ... 
  }

  high_scores.push({
    name: name,
    score: correctCount
  }); /// and push them into an array called high_scores
  console.log(high_scores); // debugging only

  localStorage.setItem("scores", JSON.stringify(high_scores)); //adds item to local storage 

  high_scores.sort(function (a, b) { //  sort through array... 
    return b.score - a.score; // ... and sort in descending order
  });

  var contentUL = document.createElement("ul"); // create ul item to DOM

  for (var i = 0; i < high_scores.length; i++) { // loop through scores array b... 
    var contentLI = document.createElement("li"); // ... and create an li's for the above ul
    contentLI.textContent =
      "Name: " + high_scores[i].name + " Score: " + high_scores[i].score; //set the textContent for the li's
    contentUL.appendChild(contentLI); //  append the li's to the ul
  }

  document.body.appendChild(contentUL); //  append the ul to the body
}
//_____________________________________________________________________________
function updateTime() { // step 3a - called by step 2-renderQuestion to decrement time or endQuiz
  time--; // decrements the time
  timerEl.textContent = "Time Left: " + time; // updates DOM time counter
  if (time <= 0) { // if time expires, or time subtraction forces value <=0 call endQuiz
    endQuiz(); // calls endQuiz()
  }
}
//_____________________________________________________________________________
function renderQuestion() { // step 2 - renders question and starts timer

  if (time === 0) { // checks to see if still time, 
    updateTime(); // if no time calls updateTime   ---activate after styling
    return; //  why is this return needed ?
  }

  // if time is left calls updateTime at 1 second intervals
  // intervalId = setInterval(updateTime, 1000); //add timer that will call updateTime every second
  questionNumEl.textContent = "Question " + (questionIndex + 1) + ":"; //trying to get Question number
  questionEl.textContent = questions[questionIndex].question; //renders current question to DOM

  optionListEl.innerHTML = ""; // clears the optionListEl
  questionResultEl.innerHTML = ""; // clears the questionResultEl

  var choices = questions[questionIndex].choices; // easier way to write the right side of the expression
  // var choicesLength = choices.length;

  for (var i = 0; i < choices.length; i++) {
    var questionListItem = document.createElement("li");
    questionListItem.textContent = choices[i];
    questionListItem.setAttribute("class", "btn");
    optionListEl.append(questionListItem);
  }
}
//_____________________________________________________________________________
function nextQuestion() { //  step 4 - increments index, checks to see if more questions; if not sets time to 0, then goes back to step 1 - renderQuestion
  questionIndex++; //increments the Question Index by 1
  if (questionIndex === questions.length) { // if no more questions...
    time = 0; // ... sets time to zero, thereby ends game...
  }
  renderQuestion(); //... or if there are more questions calls renderQuestion again
}
//_____________________________________________________________________________
function checkAnswer(event) { // step 3c is called  by Event listener - checks if answer is correct
  clearInterval(intervalId); // pause timer
  if (event.target.matches("li")) { //checks to make sure you click an li
    var answer = event.target.textContent; //grabs the clicked on choice
    if (answer === questions[questionIndex].answer) { // checks real vs. clicked answer
      questionResultEl.setAttribute("class", "correct"); // colors the text Blue
      questionResultEl.textContent = "Correct"; // Notify user response is correct by updating DOM
      correctCount++; //Update the correctCount if necessary
    } else {
      questionResultEl.setAttribute("class", "incorrect"); // colors the text Blue
      questionResultEl.textContent = "Incorrect"; // Notify user response is Incorrect by updating DOM
      time = time - 2; // subtract 2 seconds from time.
      timerEl.textContent = time; // updates DOM timer counter
    }
  }
  setTimeout(nextQuestion, 2000); // wait 2 seconds and call next question
}
//_____________________________________________________________________________
renderQuestion(); // step 1 -calls function renderQuestion - this is the beginning of the execution cycle...
optionListEl.addEventListener("click", checkAnswer); // ... step 3b then listens for a click, calls checkAnswer