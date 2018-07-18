// firebase initialization
var config = {
  apiKey: "INSERT API KEY HERE",
  authDomain: "bluecode-5a6a5.firebaseapp.com",
  databaseURL: "https://bluecode-5a6a5.firebaseio.com",
  projectId: "bluecode-5a6a5",
  storageBucket: "bluecode-5a6a5.appspot.com",
  messagingSenderId: "206938708131"
};
firebase.initializeApp(config);

var database = firebase.database();

// declare variables to push data from firebase
var name = "";
var destination = "";
var frequency = "";
var arrival = "";
var minutesAway = 0;




// function to capture submit click
$("#add-train").on("click", function (event) {
  event.preventDefault();

  // captures input
  name = $("#train-name").val().trim();
  destination = $("#destination-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  arrival = $("#arrival-input").val().trim();


  // TIME CONVERSION WITH MOMENT JS
  // YES I LOOKED IT UP ON THE INTERNET

  // arrival time logged back one year so it comes before current time
  // calculates difference between current time and arrival time
  // displays in format listed
  // remainder of the difference used to calculate minutes left
  // minutes left subtracted from frequency to establish next train arrival
  var newArrival = moment(arrival, "hh:mm").subtract(1, "years");
  var currentTime = moment().format("hh:mm");
  var difference = moment().diff(moment(newArrival), "minutes");
  var minutesLeft = difference % frequency;
  var minutesAway = frequency - minutesLeft;
  var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");



  // prevents empty inputs
  if ($("#train-name").val() === "") {
    alert("Please enter the train name");
  } else if ($("#destination-input").val() === "") {
    alert("Please enter the train destination");
  } else if ($("#frequency-input").val() === "") {
    alert("Please enter the train stop frequency");
  } else if ($("#arrival-input").val() === "") {
    alert("Please enter when the train will first arrive");
  }
  // sends inputs to firebase
  else {
    database.ref().push({
      name: name,
      destination: destination,
      frequency: frequency,
      nextTrain: nextTrain,
      minutesAway: minutesAway
    });

    // clears all inputs
    $("#train-name").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#arrival-input").val("");
  }
});

// adds a new row and column for each input
database.ref().on("child_added", function (snapshot) {

  var newRow = $("<tr>");
  var newTrain = $("<td>");
  var newDestination = $("<td>");
  var newFrequency = $("<td>");
  var newNextTrain = $("<td>");
  var newMinutesAway = $("<td>");

  // grabs firebase values
  newTrain.text(snapshot.val().name);
  newDestination.text(snapshot.val().destination);
  newFrequency.text(snapshot.val().frequency);
  newNextTrain.text(snapshot.val().nextTrain);
  newMinutesAway.text(snapshot.val().minutesAway);

  // appends values to new row
  newRow.append(newTrain);
  newRow.append(newDestination);
  newRow.append(newFrequency);
  newRow.append(newNextTrain);
  newRow.append(newMinutesAway);

  // appends new row to the schedule
  $("#train-schedule").append(newRow);

  // console log any errors
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});