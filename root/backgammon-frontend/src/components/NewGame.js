import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import gameService from '../services/games'

const NewGame = ({ socket, handleSocketConnection, handlePlayerColor }) => {
    const [username, setUsername] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [gameID, setGameID] = useState('')
    const handleNewGame = async (event) => {
        event.preventDefault()
        const data = await gameService.start({
            playerColor: 'w',
            playerName: username
        })
        if (data) {
            setGameID(data.gameID)
            handlePlayerColor('w')
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
            <h1>Start a New Game</h1>
            <form onSubmit={handleNewGame}>
                <div>
                    Name
                    <input id='username'
                        value={username}
                        onChange={({ target }) => setUsername(target.value)} />
                </div>
                <button id='create'>Start Game</button>
            </form>
        </div>
    )
}

export default NewGame