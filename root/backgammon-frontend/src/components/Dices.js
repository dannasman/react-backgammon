import React from 'react'

const Dices = ({ socket, game, gameID, playerColor }) => {

    const rollDices = () => {
        const diceValues = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]
        if (diceValues[0] === diceValues[1]) {
            diceValues.push(diceValues[0], diceValues[1])
        }

        socket.emit('roll', {
            gameID: gameID,
            name: game.activePlayer.name,
            moves: diceValues
        })
    }


    return (
        <div className="container">
            {game.activePlayer.color === playerColor ? (game.moves.length === 0 ? <button onClick={rollDices}>Roll Dice</button> :
                <p> Moves : {game.moves.sort().toString()}</p>) : null}
        </div >

    )
}

export default Dices