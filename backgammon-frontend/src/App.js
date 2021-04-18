import React, { useEffect, useState } from 'react'
import Board from './components/Board'
import NewGame from './components/NewGame'
import JoinGame from './components/JoinGame'
import {
	Switch,
	Route
} from 'react-router-dom'

import { io } from 'socket.io-client'
const App = () => {

	const [socket, setSocket] = useState(null)
	const [socketConnected, setSocketConnected] = useState(false)
	const [game, setGame] = useState(null)
	const [playerColor, setPlayerColor] = useState('')

	useEffect(() => {
		setSocket(io('http://localhost:3001/', { autoConnect: false, withCredentials: true, }))
	}, [])

	useEffect(() => {
		if (!socket) return
		socket.on('connect', () => {
			setSocketConnected(socket.connected)
		})
		socket.on('disconnect', () => {
			setSocketConnected(socket.connected)
		})
		socket.on('update', (data) => {
			setGame(data)
		})
	}, [socket])

	const handleSocketConnection = () => {
		if (socketConnected) {
			socket.disconnect()
		}
		else {
			socket.connect()
		}
	}

	const handlePlayerColor = (color) => {
		setPlayerColor(color)
	}

	return (
		<div className='container'>
			<Switch>
				<Route path='/game/:id'>
					<Board game={game} socket={socket} playerColor={playerColor} />
				</Route>
				<Route path='/'>
					<NewGame handleSocketConnection={handleSocketConnection} handlePlayerColor={handlePlayerColor} />
					<JoinGame handleSocketConnection={handleSocketConnection} handlePlayerColor={handlePlayerColor} />
				</Route>
			</Switch>
		</div>
	)
}

export default App;