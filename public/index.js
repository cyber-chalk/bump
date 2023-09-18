// elements on the page that change
let bank = document.getElementById("bank").innerText;
let bankNum = bank.substring(1);
let betPlaced = document.getElementById("betPlaced").value;
let button = document.getElementById("button");
let multiplierDisp = document.getElementById("bigText").innerText;
let ig = false; // for seeing if the game is running
let intglob = false; //stops the interval

//attaches to websocket
const socket = new WebSocket("ws://localhost:8080");
// const socket = new WebSocket(
// 	"wss://animated-couscous-jq6xvgjj5j72p66v-8080.app.github.dev/"
// ); // or whatever codespace

socket.onerror = (event) => {
	console.log(event);
};

socket.addEventListener("message", (event) => {
	let data1 = event.data.split(" ");
	if (data1[0] == "bank") {
		document.getElementById("bank").innerText = `$${data1[1]}`;
		bankNum = data1[1]; // updates the bank
	}
	if (data1[0] == "start") {
		console.log("started");
		ig = true;
		document.getElementById("players").innerHTML = "players: " + "120";
		// changes styles
		button.style.color = "#fff7ef";
		button.style.backgroundColor = "rgb(20, 20, 20)";
		button.children[0].innerHTML = "cashout";

		//starts multiplier
		let multiplier = 100;
		let MID = setInterval(() => {
			if (intglob) {
				clearInterval(MID);
				intglob = false;
				return; // checks if game stopped
			}
			// console.log("ticking");
			document.getElementById("bigText").innerText =
				(multiplier / 100).toFixed(2) + "x";
			multiplier++; // updates multipier
		}, 60);
	}
	if (data1[0] == "crash") {
		ig = false;
		console.log("crashed");
		document.getElementsByClassName("prevGame")[0].innerText = (
			data1[1] / 100
		).toFixed(2); // turns multipier into decimal form
		intglob = true;
		// document.getElementById("bigText").innerText = "1.00" + "x";
		button.style = "";
		button.children[0].innerHTML = "place bet";
	}
	if (data1[0] == "left") {
		let players = document.getElementById("players").innerHTML;
		// updates the player count
		let num =
			document.getElementById("players").innerHTML.split(" ")[1] - 1;
		document.getElementById("players").innerHTML = "players: " + num;
	}
});

button.addEventListener("click", function () {
	if (ig) {
		// if cashout button is clicked
		button.style.backgroundColor = "#7b4d2b";
		button.children[0].innerHTML = "waiting...";
		button.style.color = "";
		socket.send(`cashout ${multiplierDisp * 100} ${betPlaced}`);
		return;
	}
	// if start button is clicked
	console.log(bankNum, betPlaced);
	if (bankNum - betPlaced <= 0 || bankNum - betPlaced == NaN) return;
	bankNum -= betPlaced;
	document.getElementById("bank").innerText = `$${bankNum}`;
	console.log(bank);
	button.style.backgroundColor = "#7b4d2b";
	button.children[0].innerHTML = "waiting...";
	console.log(button.children[0].innerHTML);

	socket.send(`bet ${betPlaced}`);
});

//steps
// hook up web sockets, 🟢 bank, 🟢 game start, 🟢timer, 🟢 multiplier start, 🟢 cashout and 🟢 game end
// add a true/false thing so when you press the button while the game is runnign

// game needs to replay without reloading 🟢
// mabe add live players in game count 🟢
// comment code 🟢
// func only allows one bot to leave at a time (go into negatives), move n 🟢
// randomise pdf x
