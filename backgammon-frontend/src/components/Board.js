import React, { useEffect } from 'react'
import Triangle from './Triangle'
import Dices from './Dices'
import { useParams } from 'react-router-dom'

const Board = ({ game, socket, playerColor }) => {
    const id = useParams().id

    useEffect(() => {
        if (socket) { socket.emit('join', id) }
    }, [socket, id])

    const handleTriangleClick = (point) => {
        if (game.activePlayer.color === playerColor) {
            socket.emit('move', {
                point: point,
                gameID: id
            })
        }
    }

    const endTurn = () => {
        if (game.activePlayer.color === playerColor) {
            socket.emit('endTurn', { gameID: id })
        }
    }

    const resetSelection = () => {
        if (game.activePlayer.color === playerColor) {
            socket.emit('resetSelection', { gameID: id })
        }
    }

    const readyForTakingHome = () => {
        const start = playerColor === 'w' ? 0 : 6
        const end = playerColor === 'w' ? 17 : 23
        const notHome = game.board.slice(start, end + 1)
        return !notHome.find(p => p.includes(playerColor)) && game.eaten[playerColor].length === 0 && game.activePlayer.color === playerColor
    }

    const boardStyle = {
        width: 600,
        height: 600,
        padding: 0,
        margin: 0,
        borderStyle: "solid",
        borderColor: "saddlebrown",
        backgroundColor: "#ffdead",
        boxSizing: "content-box"
    }

    const sideStyle = {
        width: 600,
        height: 300,
        padding: 0,
        margin: 0
    }
    if (!game || !game.activePlayer || !socket) return null

    return (
        <div className="container">
            <div className="container" style={boardStyle}>
                <div className="row" style={sideStyle}>
                    {game.board.filter((s, i) => i < 12).reverse().map((s, i) => <Triangle key={11 - i} game={game} selectedTriangle={game.selectedTriangle} checkers={s} point={11 - i} handleTriangleClick={handleTriangleClick} />)}
                </div>
                <div className="row" style={sideStyle} >
                    {game.board.filter((s, i) => i >= 12).map((s, i) => <Triangle key={i + 12} game={game} selectedTriangle={game.selectedTriangle} checkers={s} point={i + 12} handleTriangleClick={handleTriangleClick} />)}
                </div>
            </div >
            <Dices socket={socket} game={game} gameID={id} playerColor={playerColor} />
            {readyForTakingHome() ? <div className="container">
                <button onClick={endTurn}>end turn</button>
                <button onClick={resetSelection}>reset triangle selection</button>
            </div> : null}
        </div >
    )
}

/*
{ readyForTakingHome(game.whiteTurn ? 'w' : 'b',) ?
                <div className="container">
                    <button onClick={endTurn}>end turn</button>
                    <button onClick={() => setSelectedTriangle(game.whiteTurn ? -1 : 24)}>reset triangle selection</button>
                </div> : null}
*/

export default Board