let bank = document.getElementById("bank").innerText;
let bankNum = bank.substring(1);
let betPlaced = document.getElementById("betPlaced").value;
let button = document.getElementById("button");
let multiplyerDisp = document.getElementById("bigText").innerText;

const socket = new WebSocket("ws://localhost:8080");
socket.onerror = (event) => {
	console.log(event);
};


socket.addEventListener("message", (event) => {
	let data1 = event.data.split(" ");
	if (data1[0] == "bank") {
		document.getElementById("bank").innerText = `$${data1[1]}`;
		bankNum = data1[1];
	}
	if (data1[0] == "start") {
		button.style.color = "#fff7ef";
		button.style.backgroundColor = "rgb(20, 20, 20)";

		let multiplyer = 100;
		let MID = setInterval(() => {
			multiplyerDisp = (multiplyer / 100).toFixed(2);
			multiplyer++;
		}, 50);
	}
	if (data1[0] == "crash") {
		document.getElementsByClassName("prevGame").innerText = data1[1];
		clearInterval(MID);
		multiplyerDisp = "0.00";
		button.style = "";
	}
});

button.addEventListener("click", function () {
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
// hook up web sockets, 🟢 bank, 🟢 game start, 🟢timer, 🟢 multiplyer start, cashout and game end
// add a true/false thing so when you press the button while the game is runnign
