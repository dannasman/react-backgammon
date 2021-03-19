import React, { useState } from 'react'
import Board from './components/Board'
import {
	BrowserRouter as Router
} from "react-router-dom"

const App = () => {
	const [game, setGame] = useState(null)

	const createGame = () => {
		setGame({
			state: [
				"ww",
				"",
				"",
				"",
				"",
				"bbbbb",
				"",
				"bbb",
				"",
				"",
				"",
				"wwwww",
				"bbbbb",
				"",
				"",
				"",
				"www",
				"",
				"wwwww",
				"",
				"",
				"",
				"",
				"bb"
			],
			home: {
				"w": "",
				"b": "",
			},
			eaten: {
				"w": "",
				"b": "",
			},
			whiteTurn: true,
			moves: []
		})
	}

	const updateGame = (updatedGame) => {
		setGame(updatedGame)
	}

	const exitGame = async () => {
		setGame(null)
	}

	return (
		<Router>
			{game ? <Board game={game} updateGame={updateGame} exitGame={exitGame} /> : <button onClick={createGame}>create a game</button>}
		</Router>
	)
}

export default App;