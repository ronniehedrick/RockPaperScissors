
  var config = {
    apiKey: "AIzaSyDeoAGKCvAPu7Akd0_Z2S6ZoG2e1qo3xg8",
    authDomain: "rpsmulti-d1909.firebaseapp.com",
    databaseURL: "https://rpsmulti-d1909.firebaseio.com",
    projectId: "rpsmulti-d1909",
    storageBucket: "rpsmulti-d1909.appspot.com",
    messagingSenderId: "690074755579"
  };
firebase.initializeApp(config);

var database = firebase.database();

var turnNum=0;
var player1Wins=0;
var player2Wins=0;
var player1Losses=0;
var player2Losses=0;
var player1Name="";
var player2Name="";

var rps={
	displayRPS: function(){
		for (i=1; i<3; i++){
		$("#player"+i+"Panel").html("<a class='btn btn-danger btn-md option' id='rock'>Rock</a>");
		$("#player"+i+"Panel").append("<a class='btn btn-danger btn-md option' id='paper'>Paper</a>");
		$("#player"+i+"Panel").append("<a class='btn btn-danger btn-md option' id='scissors'>Scissors</a>");
		}
	},
	getChoices: function(player1Choice, player2Choice){
		// Establish & assign boolean values to winner vars for easy readability
		var player1 = true;
		var player2 = false;

		// Initialize return var
		var gameResult = "";

		// Use switch statements for better readability
		if (player1Choice == "rock") {
			switch (player2Choice) {
    			case "paper":
    	    		gameResult = player2;
    	    		player2Wins++;
    	    		player1Losses++;
    	    		break;
    			case "scissors":
    	    		gameResult = player1;
    	    		player1Wins++;
    	    		player2Losses++;
    	    		break;
    			default:
    	    		gameResult = "tie";
    	    }
		} else if (player1Choice == "paper") {
			switch (player2Choice) {
				case "rock":
					gameResult = player1;
					player1Wins++;
					player2Losses++;
					break;
				case "scissors":
					gameResult = player2;
					player2Wins++;
					player1Losses++;
					break;
				default:
					gameResult = "tie";
			}
		} else if (player1Choice == "scissors") {
			switch (player2Choice) {
				case "rock":
					gameResult = player2;
					player2Wins++;
					player1Losses++;
					break;
				case "paper":
					gameResult = player1;
					player1Wins++;
					player2Losses++;
					break;
				default:
					gameResult = "tie";
			}
		}

		if (gameResult == "tie") {
			console.log("Tied game!");

		} else if (gameResult) {
			console.log("Player 1 won!");
			// Player 1 won. Update player 1 win and player 2 loss count in db
			database.ref().child("players").child("1").update({
				wins: player1Wins
			})
			database.ref().child("players").child("2").update({
				losses: player2Losses
			})

		} else if (!gameResult) {
			console.log("Player 2 won!");
			// Player 2 won
			database.ref().child("players").child("2").update({
				wins: player2Wins
			})
			database.ref().child("players").child("1").update({
				losses: player1Losses
			})

		}
	},

};

database.ref().on("value", function(snapshot) {
	var key=snapshot.val();

	if(snapshot.child("players").child("1").exists()){
		player1Name=key.players["1"].name;
		console.log("player1Name inside of exists check: " + player1Name);
		$('#player1title').html(player1Name);
	}
	if(snapshot.child("players").child("2").exists()){
		player2Name=key.players["2"].name;
		console.log("player2Name inside of exists check: " + player2Name);
		$('#player2title').html(player2Name);
	}
	console.log("player1Name: " + player1Name);
	console.log("player2Name: " + player2Name);

}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

$(document).ready(function(){
	$("#playerButton").on('click', function(){
		console.log("button");
		var playerName=$("#playerName").val().trim();
		if (playerName == ""){
			alert("You haven't type a valid name");
			return false;
		}
		if (player1Name == ""){
			player1Name = playerName;
			database.ref().set({
				players: {
					1: {
						name: playerName,
						wins: 0,
						losses: 0
					}
				}
			});
			$(".form-group").html("<p>Hi "+player1Name+", you are player 1.</p>");
			} else if (player1Name != "" && player2Name == ""){
				player2Name = playerName;
				database.ref().child("players").child("2").set({
					name: playerName,
					wins: 0,
					losses: 0
				});
			$(".form-group").html("<p>Hi "+player2Name+", you are player 2.</p>");
			database.ref().child("turn").set(1);
			} else {
				alert("There are already two active players! Somebody must leave first before adding a new player.");
				return false;
			}
	rps.displayRPS();
	});
	
});