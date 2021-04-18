import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import gameService from '../services/games'

const JoinGame = ({ handleSocketConnection, handlePlayerColor }) => {
    const [gameID, setGameID] = useState('')
    const [username, setUsername] = useState('')
    const [redirect, setRedirect] = useState(false)

    const handleJoinGame = async (event) => {
        event.preventDefault()
        const data = await gameService.join({
            gameID: gameID,
            playerName: username
        })
        if (data) {
            setGameID(data.gameID)
            handlePlayerColor('b')
            setRedirect(true)
            handleSocketConnection()
        }
    }

    if (redirect) {
        return (
            <Redirect to={`/game/${gameID}`} />
        )
    }

    return (
        <div>
            <h1>Join an Existing Game</h1>
            <form onSubmit={handleJoinGame}>
                <div>
                    Game ID
                    <input id='gameID'
                        value={gameID}
                        onChange={({ target }) => setGameID(target.value)} />
                </div>
                <div>
                    Name
                    <input id='username'
                        value={username}
                        onChange={({ target }) => setUsername(target.value)} />
                </div>
                <button id='join'>Join Game</button>
            </form>
        </div>
    )
}

export default JoinGame