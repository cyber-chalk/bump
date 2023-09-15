let bank = document.getElementById("bank").innerText;
let betPlaced = document.getElementById("betPlaced").value;
let button = document.getElementById("button");

button.addEventListener("click", function () {
	console.log(bank, betPlaced);
	if (bank - betPlaced <= 0) return;
	bank = bank - betPlaced;
	button.style.backgroundColor = "#7b4d2b";
});
