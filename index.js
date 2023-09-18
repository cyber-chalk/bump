const express = require("express");
const app = express();

app.use(express.static("public")); // uses the public folder for static files

app.listen(3000); // uses http://localhost:3000/

const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

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
	// adds randomness to a number
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

let bank = 100;
let multiplier = 100;

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function game(amountPayed, ws) {
	bank -= amountPayed;
	let exitArr = []; // holds cashouts per second
	let players = 100;
	let skip = false; // crashes and skips code

	let rpd = Math.floor(getRandom(1, 100));
	if (rpd > 95) {
		skip = true;
		console.log("instant");
	}

	for (let i = 0; i < players; i++) {
		exitArr.push(betaPDF(i / players, 2.4, 4));

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
	// console.log(exitArr);
	//multiplier GAME OFFICALLY STARTS
	let lapsed = 0; // time elapsed since last exit
	let n = 0; // counter
	let leave = 0; //adds beta distrobution and when 1 person has been accounted for it leaves
	let incrementCounter = 0;
	let secondpassed = false;
	ws.send("start");

	let intID = setInterval(() => {
		if (multiplier == 100) multiplier += 1;
		multiplier += 1;

		if (secondpassed) {
			// checks if a second has passed
			// gets cashouts per second and puts it in usable format
			leave += exitArr[n];
			if (leave >= 1) {
				let rounded = Math.floor(leave); // the amount of bots
				console.log("person left", rounded);
				ws.send("left");
				for (let i = 0; i < rounded - 1; i++) {
					console.log("worked");
					ws.send("left");
				}
				leave -= rounded;
				lapsed = Math.max(0, lapsed - 60);
			}
			n++;
		}

		incrementCounter++;

		lapsed = Math.max(0, tick(lapsed));
		// console.log("after tick", lapsed);
		if (lapsed != 0 || skip == true) {
			// crash
			console.log("crashing lapsed:", lapsed);
			clearInterval(intID);
			ws.send(`crash ${multiplier}`);
			multiplier = 100;
			return;
		}
		lapsed += 60;
		if (secondpassed) secondpassed = false;
		if (incrementCounter >= 6) {
			secondpassed = true;
			incrementCounter = 0;
		}
		// 60 miliseconds * 16 is roughly = 1 sec which has been changed to half a second
		// needed to see if the seconds change
	}, 60);
}

function tick(probability) {
	let dev = (probability * 2) / 100;
	let rand = Math.round(getRandom(1, 200));
	// probability increases as time without cashout gets higher
	if (rand + dev >= 200) {
		console.log("did not pass if", rand, dev, probability);
		//crash
		return probability;
	} else {
		return -60;
	}
}

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);
	ws.send(`bank ${bank}`);

	ws.on("message", function message(data) {
		console.log("received:", data.toString());
		let data1 = data.toString().split(" ");
		if (data1[0] == "bet") game(data1[1], ws);

		if (data1[0] == "cashout") {
			if (data1[1] != multiplier)
				console.log("issue", data1[1], multiplier);
			let winnings = (data1[2] / 100).toFixed(2) * multiplier;
			bank += winnings;
			ws.send(`bank ${bank}`);
		}
	});
});
