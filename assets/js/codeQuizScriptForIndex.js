var questions = [{
    question: "What Ingredient isn't part of the German Beer Purity Law: Reinheitsgebot?",
    choices: ["Barley", "Yeast", "Water", "Hops"],
    answer: "Yeast",
  },
  {
    question: "What is the study or practice of fermentation in brewing?",
    choices: ["Barleyology", "Zymurgy", "Axiology", "Embibeology"],
    answer: "Zymurgy",
  },
  {
    question: "What style of Beer is Burton-on-Trent known for?",
    choices: ["Pilsener", "Pale Ale", "Dunkel", "Stout"],
    answer: "Pale Ale",
  },
  {
    question: "What ingredient put into beer helps fight bacteria",
    choices: ["Gypsum", "Campden Tablets", "Finings", "Hops"],
    answer: "Hops",
  },
  {
    question: "Which of these is not a Hop?",
    choices: ["Millenium", "Tomahawk", "Pilgrim", "Victory"],
    answer: "Victory",
  },
  {
    question: "How many Calories does a typical pint of Lager have?",
    choices: ["185", "310", "215", "150"],
    answer: "215",
  },
  {
    question: "In what year was the Beer Can introduced?",
    choices: ["1905", "1920", "1925", "1935"],
    answer: "1935",
  },
  {
    question: "Which of these beers does not contain Rice as an ingredient",
    choices: ["Budweiser", "Corona", "Kirin", "San Miguel"],
    answer: "San Miguel",
  },
  {
    question: "Which is the largest Hop-producing country in the World?",
    choices: ["China", "US", "Germany", "Czech Rep"],
    answer: "Germany",
  },
  {
    question: "What is the oldest beer brand still being brewed today",
    choices: ["Augustiner", "Weihensephan", "Chimay", "Duvel"],
    answer: "Weihensephan",
  },
];

var domScoreEl = document.querySelector("#domScore");
var startQuizBtnEl = document.querySelector("#startQuizBtn");
var introSectionEl = document.querySelector("#introSection") //use this to hide
var questionSectionEl = document.querySelector("#questionSelection") //maybe use this to hide? Not Used
var questionNumEl = document.querySelector("#questionNum");
var questionEl = document.querySelector("#question");
var optionListEl = document.querySelector("#option-list");
var questionResultEl = document.querySelector("#question-result");
var timerEl = document.querySelector("#timer");
var clearHiScoresEl = document.querySelector("#clear-scores");
console.log("Hello", clearHiScoresEl) //debugging only. Points to adEventListener Element

var questionIndex = 0; // for accessing the current object by index in array above
var correctCount = 0; // for incrementing when an answer is correct
var time = 30; // holds length of game
var intervalId; // holds return of the setInterval ID
var newline = "\r\n";
var nbsp = "\u00a0";
var dash = " -- "

//_____________________________________________________________________________
function endQuiz() { //step 4- ends the quiz and calls show high score
  clearInterval(intervalId); // stops the timer
  var body = document.body; // easier way of writing document.body

  body.innerHTML = "" // clears the body and updates DOM to indicate game is over
  var h2El = document.createElement("h2");
  h2El.textContent = "Game over!" + newline + "You answered" + newline + correctCount + nbsp + "correctly.";
  body.append(h2El);
  setTimeout(showHighScoreAndRedirect, 2000); // wait 2 seconds then call function to render high score page
}

//_____________________________________________________________________________
function showHighScoreAndRedirect() { // step 5 clear page and show high score

//   var inpH3El = document.createElement("h3");
//   inpH3El.textContent = "Enter Your Name..."
//   var body = document.body;
//   body.append(inpH3El);
  
//   do {
//   var inputEl = document.createElement("input");
//   inputEl.type = "text";
//   inputEl.className = "css-class-name"; // set the CSS class
//   inputEl.placeholder = "nameHere..."
//   inputEl.value = ""
//   body.appendChild(inputEl); // put it into the DOM
// } while (!inputEl.value.value);
//   var name = inputEl.value;
  
  do {
    var name = prompt("Please enter your name"); //ask user to enter their name and validate
  } while (!name);
 
  add_new_value_to_local_storage(name, correctCount);
  

  // ----------------------- Break to new page ----------------------------------
  location.href = 'highScores.html';
}

// ____________________________________________________________________________
function add_new_value_to_local_storage(user_name, score) {
  var high_scores = localStorage.getItem("scores"); //check to see if any scores in array...

  if (!high_scores) { // ...if no scores in array...
    high_scores = []; // ... initialize array ...
  } else {
    high_scores = JSON.parse(high_scores); // ... or parse the high scores that exist, 
    // which exist as strings and need to be converted back to object/array ... 
  }
  high_scores.push({
    name: user_name,
    score: score
  }); /// and push them into an array called high_scores
  console.log(high_scores); // debugging only

  localStorage.setItem("scores", JSON.stringify(high_scores)); //adds item to local storage 

  appendArrayToDOM(high_scores);

}

// ____________________________________________________________________________
function appendArrayToDOM(array_to_append) {

  array_to_append.sort(function (a, b) { //  sort through array... 
    return b.score - a.score; // ... and sort in descending order
  });

  var contentUL = document.createElement("ul"); // create ul item to DOM

  for (var i = 0; i < array_to_append.length; i++) { // loop through scores array b... 
    var contentLI = document.createElement("li"); // ... and create an li's for the above ul
    contentLI.textContent =
      "Name: " + array_to_append[i].name + dash + " Score: " + array_to_append[i].score; //set the textContent for the li's
    contentUL.appendChild(contentLI); //  append the li's to the ul
    contentUL.setAttribute("class","scoreUL");
    
  }
  // render to another page - create a new HTML page inside create a div with 

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
  intervalId = setInterval(updateTime, 1000); //add timer that will call updateTime every second
  questionNumEl.textContent = "Question " + (questionIndex + 1) + ":"; //trying to get Question number
  questionEl.textContent = questions[questionIndex].question; //renders current question to DOM

  optionListEl.innerHTML = ""; // clears the optionListEl
  questionResultEl.innerHTML = ""; // clears the questionResultEl

  var choices = questions[questionIndex].choices; // easier way to write var choicesLength = choices.length;

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
      scrollToTop();
      correctCount++; //Update the correctCount if necessary
      domScoreEl.textContent = "Score: " + correctCount;
    } else {
      questionResultEl.setAttribute("class", "incorrect"); // colors the text Blue
      questionResultEl.textContent = "Incorrect"; // Notify user response is Incorrect by updating DOM
      scrollToTop();
      time = time - 2; // subtract 2 seconds from time.
      timerEl.textContent = "Time Left: " + time; // updates DOM timer counter
    }
  }
  setTimeout(nextQuestion, 1000); // wait 2 seconds and call next question
}

var high_score = document.getElementById("highScoresList");

if (high_score) {
  appendArrayToDOM(JSON.parse(localStorage.getItem("scores")));

}

function clearStorage() {
  console.log("Hello World");
  localStorage.clear();
  location.reload();
}

if (clearHiScoresEl) {
  clearHiScoresEl.addEventListener("click", clearStorage);
}

//__________________________________________________________________
// renderQuestion(); // step 0 -calls function hideIntro - this is the beginning of the execution cycle...
if (startQuizBtnEl) {
  startQuizBtnEl.addEventListener("click", hideIntro);

  optionListEl.addEventListener("click", checkAnswer); // ... step 3b then listens for a click, calls checkAnswer
}
//___________________________________________________________________

function hideIntro() { //hides the introduction and Start Quiz Button
  introSectionEl.setAttribute("style", "display:none;");
  renderQuestion();
}
//____________________________________________________________________
function scrollToTop() {
  window.scrollTo(0, document.body.scrollHeight);
};

// ___________________________________________________________________
// clearHiScores.addEventListener("click", function () {
//   window.localStorage.clear();
// });