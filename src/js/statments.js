export const board = Array.from(document.querySelectorAll('.the-col'));
export const statments = {
	markersToPlayer: {"X": "player1", "O": "player2"},
	playersToMarker: {"player1": "X", "player2": "O"},
	turn: 0,
	scoreBoard : [],
	playGame: false,
	AI_play: true,
	gamesPlayed: 0,
	markerOrder: {"first": "X", "second": "O"},
	players_text: {"player1": "Player 1", "player2": "Player 2"}
}