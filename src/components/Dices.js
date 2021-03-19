import React, { useState } from 'react'

const Dices = ({ game, updateGame }) => {

    const rollDices = () => {
        const diceValues = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]
        if (diceValues[0] === diceValues[1]) {
            diceValues.push(diceValues[0], diceValues[1])
        }
        const updatedGame = { ...game, moves: diceValues }
        updateGame(updatedGame)
    }

    if (game.moves.length === 0) {
        return <div>
            <button onClick={rollDices}>roll dices</button>
        </div>
    }

    return (
        <div>
            Moves: {game.moves.sort().toString()}
        </div>

    )
}

export default Dices