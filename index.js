const express = require("express");
const app = express();

app.use(express.static("public")); // uses the public folder for static files

app.listen(3000);

const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

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

let bank = 100;

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

// let previousArr = [];
// function previousGames(multipler) {
// 	previousArr.push(multipler);
// }

async function game(amountPayed) {
	bank -= amountPayed;
	let exitArr = [];
	let players = 100;
	let multiplier = 100;
	// no 5 second wait
	let rpd = Math.floor(getRandom(1, 100));
	//prettier-ignore
	if (rpd > 95) return crash(100);

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

	wss.on("listening", function (ws) {
		ws.send("start");

		let intID = setInterval(() => {
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
			tick(lapsed);
			if (lapsed != 0) {
				clearInterval(intID);
				return ws.send(`crash ${multiplyer}`);
			}
		}, 50);
	});
}

function tick(probability) {
	probability = (probability * 2) / 100;
	if (getRandom(0, 10) + probability >= 10) {
		// change number pls
		//crash
		return;
	} else {
		return (lapsed = 0);
	}
}

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);

	ws.on("message", function message(data) {
		console.log("received:", data);
		let data1 = data.split(" ");
		if (data1[0] == "bet") game(data1[1]);
	});

	ws.send(`bank ${bank}`);
});
