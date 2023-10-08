import {
	statments
} from './statments.js'; // импортируем состояния


function gameStart(isContinue = false) {
	const board = Array.from(document.querySelectorAll('.the-col'));
	document.querySelector("#game__result").textContent = "Game in Progress"
	if (!isContinue) {
		board.forEach(el => el.innerText = "")
		statments.turn = 0
		statments.scoreBoard = []
	}
	
	//Determining corresponding markers
	const markerButton = document.querySelectorAll('input[type="checkbox"]')
	
	if(markerButton[1].checked === false){
		statments.markersToPlayer = {"O": "player1", "X": "player2"}
		statments.playersToMarker = {"player1": "O", "player2": "X"}
	} else {
		statments.markersToPlayer = {"X": "player1", "O": "player2"}
		statments.playersToMarker = {"player1": "X", "player2": "O"}
	}
	
	//Determining first move
	
	if(markerButton[2].checked === false){
		statments.markerOrder = {"first": "O", "second": "X"}
	} else{
		statments.markerOrder = {"first": "X", "second": "O"}
	}
	
	//Determining whether AI will play
	if(markerButton[0].checked === false){
		statments.AI_play = false
	} else {
		statments.AI_play = true
	}
	
	turnSwitcher()
}

const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
checkBoxes.forEach(checkBox => {
	checkBox.addEventListener('change', () => {
		gameStart();
	})
})

function checkWinCombination(ScoreBoard){
	const pairings = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
	for(let i = 0; i < pairings.length; i++){
		if ((ScoreBoard[pairings[i][0]] === ScoreBoard[pairings[i][1]]) && (ScoreBoard[pairings[i][1]] === ScoreBoard[pairings[i][2]])){
			if (statments.markersToPlayer[ScoreBoard[pairings[i][0]]] !== undefined){
				return statments.markersToPlayer[ScoreBoard[pairings[i][0]]]
			}
		}
	}
	
	if (ScoreBoard.indexOf("") === -1){
		return "Tie"
	}
	
	return null
}

function setWinner() {
	const board = Array.from(document.querySelectorAll('.the-col'));
	statments.scoreBoard = ["&"]
	for(let i = 0; i < board.length; i++){
		statments.scoreBoard.push(board[i].innerText)
	}
	let winner = checkWinCombination(statments.scoreBoard)
	if ((winner != null) && (winner !== "Tie")){
		document.querySelector("#game__result").textContent = statments.players_text[winner] + " has won"
		statments.gamesPlayed++
		return true;
	} else if(winner === "Tie"){
		document.querySelector("#game__result").textContent = "The game is tied"
		statments.gamesPlayed++
		return true;
	}
	
	return false;
}

function setTurn(event){
	const board = Array.from(document.querySelectorAll('.the-col'));
	if(event.target.innerText === ""){
		if(statments.turn % 2 === 0){
			event.target.innerText = statments.markerOrder["first"]
		} else {
			event.target.innerText = statments.markerOrder["second"]
		}
		if (setWinner()) {
			return;
		}
		board.forEach(el => el.removeEventListener("click", setTurn))
		statments.turn++
		turnSwitcher()
	}
}

function setGameLogic() {
	const board = Array.from(document.querySelectorAll('.the-col'));
	function scoreHandle(){
		let bestMove
		let bestScore = -Infinity
		for (let i = 0; i < statments.scoreBoard.length; i++){
			if (statments.scoreBoard[i] === ""){
				statments.scoreBoard[i] = statments.playersToMarker["player2"]
				let score = setMinMax(statments.scoreBoard, 0, false)
				statments.scoreBoard[i] = ""
				if (score > bestScore){
					bestScore = score
					bestMove = i
				}
			}
		}
		return bestMove
	}
	function setMinMax(board, depth, isMaximizing){
		let scores = {
			"player1": -1,
			"player2": 1,
			"Tie": 0,
		}
		let result = checkWinCombination(statments.scoreBoard)
		if (result != null){
			return scores[result]
		}
		if (isMaximizing){
			let bestScore = -Infinity
			for (let i = 0; i < statments.scoreBoard.length; i++){
				if (statments.scoreBoard[i] === ""){
					statments.scoreBoard[i] = statments.playersToMarker["player2"]
					let score = setMinMax(statments.scoreBoard, depth + 1, false)
					statments.scoreBoard[i] = ""
					bestScore = Math.max(score, bestScore)
				}
			}
			return bestScore
			
		} else {
			let bestScore = Infinity
			for (let i = 0; i < statments.scoreBoard.length; i++){
				if (statments.scoreBoard[i] === ""){
					statments.scoreBoard[i] = statments.playersToMarker["player1"]
					let score = setMinMax(statments.scoreBoard, depth + 1, true)
					statments.scoreBoard[i] = ""
					bestScore = Math.min(score, bestScore)
				}
			}
			return bestScore
		}
	}
	board[scoreHandle() - 1].innerText = statments.playersToMarker["player2"]
	if (setWinner()) {
		return;
	}
	
	statments.turn++
	turnSwitcher()
}

function turnSwitcher(){
	const board = Array.from(document.querySelectorAll('.the-col'));
	let playerFunctions = {
		player1 : function () {
			board.forEach(el => el.addEventListener("click", setTurn))
			document.querySelector("#game__result").textContent = "It's " + statments.players_text["player1"] + "'s move"
		},
		player2 : function () {
			document.querySelector("#game__result").textContent = "It's " + statments.players_text["player2"] + "'s move"
			if (statments.AI_play){
				setGameLogic()
			} else {
				board.forEach(el => el.addEventListener("click", setTurn))
			}
		}
	}
	let firstPlayer = statments.markersToPlayer[statments.markerOrder["first"]]
	let secondPlayer = statments.markersToPlayer[statments.markerOrder["second"]]
	
	if (statments.turn === 0){
		setWinner()
	}
	if(statments.turn % 2 === 0){
		playerFunctions[firstPlayer]()
	} else {
		playerFunctions[secondPlayer]()
	}
}

function saveGame(){
	const currentGame = document.querySelector(".main__container");
	window.localStorage.setItem('currentGame', currentGame.innerHTML);
	const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
	checkBoxes.forEach((checkbox, index) => statments.checkBoxes[index] = checkbox.checked)
	localStorage.setItem('checkBoxes', JSON.stringify(statments.checkBoxes));
}

function setSavedGame() {
	statments.checkBoxes = localStorage.getItem('checkBoxes')
		? JSON.parse(localStorage.getItem('checkBoxes'))
		: statments.checkBoxes;
	const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
	checkBoxes.forEach((checkBox, index) => checkBox.checked = statments.checkBoxes[index])
	
	const board = Array.from(document.querySelectorAll('.the-col'));
	const currentGame = document.querySelector(".main__container");
	if(localStorage.getItem('currentGame')){
		currentGame.innerHTML = localStorage.getItem('currentGame')
		board.forEach((el, index) => {
			statments.scoreBoard[index + 1] = el.innerText;
			if (el.innerText !== "") {
				statments.turn++;
			}
		});
		gameStart(true);
	}
}

document.querySelector('.start__btn').addEventListener('click', () => gameStart());
document.querySelector('.save__btn').addEventListener('click', saveGame);
document.querySelector('.getSave__btn').addEventListener('click', setSavedGame);

gameStart();
