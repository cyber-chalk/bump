const express = require("express");
const app = express();

app.use(express.static("public")); // uses the public folder for static files

app.listen(3000);

const {WebSocketServer} = require("ws")

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);

	ws.on("message", function message(data) {
		console.log("received: %s", data);
	});

	ws.send("something");
});

// function naiveBetaPDF(x, a, b) {
// 	// Naive implementation of the beta pdf function
// 	// Using factorials
// 	return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)) / naiveBetaFunc(a, b);
// }
// function naiveBetaFunc(a, b) {
// 	// Naive implementation of the beta function
// 	// using factorials
// 	return (factorial(a - 1) * factorial(b - 1)) / factorial(a + b - 1);
// }
// function factorial(x) {
// 	if (x === 0) {
// 		return 1;
// 	}
// 	return x * factorial(x - 1);
// }

// for (let i = 0; i < 100; i++) {
// 	// let rand = Math.floor(Math.random() * (10 - 1) + 1) / 10;
// 	let rand = i / 100;
// 	console.log(naiveBetaPDF(rand, 2, 4));
// }

//log beta func
function betaPDF(x, a, b) {
	return Math.exp(
		(a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - lnBetaFunc(a, b)
	);
}
function lnBetaFunc(a, b) {
	let result = 0.0;

	for (i = 0; i < a - 2; i++) {
		result += Math.log(a - 1 - i);
	}
	for (i = 0; i < b - 2; i++) {
		result += Math.log(b - 1 - i);
	}
	for (i = 0; i < a + b - 2; i++) {
		result -= Math.log(a + b - 1 - i);
	}

	return result;
}

// for (let i = 0; i < 100; i++) console.log(betaPDF(i / 100, 2, 4));

function expensive(rand, i) {
	return (rand = Math.max(1, Math.min(rand, 0)));

	// if (i + rand >= 1) {
	// 	if (Boolean(Math.round(Math.random()))) {
	// 		rand *= -1;
	// 	} else {
	// 		rand = 0;
	// 	}
	// }
	// if ((i + rand <= 0)) {
	// 	if (Boolean(Math.round(Math.random()))) {
	// 		rand *= -1;
	// 	}
	// }
}

let bank = 1000;

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

let previousArr = [];
function previousGames(multipler) {
	previousArr.push(multipler);
}

async function game(amountPayed) {
	bank -= amountPayed; // update this in frontend
	let exitArr = [];
	let players = 100;
	let multiplier = 100;
	setTimeout(() => {
		// insert the bet amount through websocket
		// use await
	}, 5000);

	let rpd = Math.floor(Math.random() * (100 - 1 + 1) + 1);
	//prettier-ignore
	if (rpd > 95) return crash(1.00); // might need to change "return"

	for (let i = 0; i < 100; i++) {
		exitArr.push(betaPDF(i / players, 2, 4));

		// exitArr.push(
		// 	Math.round(
		// 		betaPDF(Math.round(getRandom(1, 100) * 10) / 1000, 2, 4) *
		// 			100
		// 	) / 100
		// );

		// 	let rand = Math.round(getRandom(1, 5) * 1) / 100;
		// 	console.log(rand);
		// 	if (!Boolean(Math.round(Math.random()))) {
		// 		rand *= -1;
		// 	}

		// 	console.log(betaPDF(expensive(rand, i), 2, 4), i / 100);

		// plus minus it with a random number gen
		// or select a random point like at first
	}

	//multiplyer GAME OFFICALLY STARTS
	let lapsed = 0; // time elapsed since last exit
	let n = 0; // counter
	let leave = 0; //adds beta distrobution and when 1 person has been accounted for it leaves
	setInterval(() => {
		if (multiplier == 100) multiplier += 1;
		multiplier += 1;
		amountPayed *= multipler / 100;

		exitArr[n] += leave;
		if (leave >= 1) {
			leave--;
			lapsed = 0;
		}
		n++;
		lapsed += 50;
		tick(lapsed, multiplier, amountPayed);
	}, 50);
}

function tick(probability, multiplier, amountPayed) {
	probability = (probability * 2) / 100;
	if (getRandom(0, 10) + probability >= 10) {
		// change number pls
		return crash(multiplier, amountPayed);
	} else {
		return (lapsed = 0);
	}
}

function crash(multiplier, amountPayed) {
	previousGames(multiplier);
	setTimeout(() => {
		// pause game and show multiplyer
	}, 3000);
	return game(20);
}
