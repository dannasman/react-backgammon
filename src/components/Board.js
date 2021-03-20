import React, { useState } from 'react'
import Triangle from './Triangle'
import Dices from './Dices'
import styles from './Board.module.css'

const Board = ({ game, updateGame, exitGame }) => {
    const [selectedTriangle, setSelectedTriangle] = useState(game.whiteTurn ? -1 : 24)

    const readyForTakingHome = (color) => {
        const start = game.whiteTurn ? 0 : 6
        const end = game.whiteTurn ? 17 : 23
        const notHome = game.state.slice(start, end + 1)
        return !notHome.find(p => p.includes(color)) && game.eaten[color].length === 0
    }

    const makeMove = (point, color, k) => {
        let state = [...game.state]
        let moves = [...game.moves]
        let eaten = { ...game.eaten }

        if (game.eaten[color].length === 0) {
            state[selectedTriangle] = state[selectedTriangle].slice(0, -1)
        }

        if (game.eaten[color].length > 0) {
            eaten[color] = eaten[color].slice(0, -1)
        }

        if (!state[point].includes(color) && state[point].length === 1) {
            state[point] = state[point].slice(0, -1)
            const opponent = !game.whiteTurn ? 'w' : 'b'
            eaten[opponent] += opponent
        }

        state[point] += color
        moves.splice(moves.findIndex(m => m === (point - selectedTriangle) * k), 1)
        const updatedGame = { ...game, state: state, moves: moves, whiteTurn: moves.length === 0 ? !game.whiteTurn : game.whiteTurn, eaten: eaten }

        setSelectedTriangle(updatedGame.whiteTurn ? -1 : 24)
        updateGame(updatedGame)
    }

    const takeHome = (point, color, k) => {
        let state = [...game.state]
        let home = { ...game.home }
        let moves = [...game.moves]
        const helper = game.whiteTurn ? 23 : 0
        state[point] = state[point].slice(0, -1)
        home[color] += color
        moves.splice(moves.findIndex(m => m === (helper - point * k + 1)), 1)
        const updatedGame = { ...game, moves: moves, state: state, whiteTurn: moves.length === 0 ? !game.whiteTurn : game.whiteTurn, home: home }
        setSelectedTriangle(updatedGame.whiteTurn ? -1 : 24)
        updateGame(updatedGame)
    }

    const handleTriangleClick = (point) => {
        const color = game.whiteTurn ? 'w' : 'b'
        const k = game.whiteTurn ? 1 : -1
        console.log(game)
        const helper = game.whiteTurn ? 23 : 0
        if (readyForTakingHome(color)) {
            console.log(helper - point + 1)
            if ((selectedTriangle === -1 || selectedTriangle === 24) && game.state[point].includes(color)) {
                setSelectedTriangle(point)
            }
            else if (point === selectedTriangle && game.moves.find(m => m === helper - point * k + 1)) {
                takeHome(point, color, k)
            }
            else if ((selectedTriangle !== -1 && selectedTriangle !== 24) && game.moves.find(m => selectedTriangle + k * m === point)) {
                if (game.state[point].length < 2 || game.state[point].includes(color)) {
                    makeMove(point, color, k)
                }
            }
        }
        else if ((selectedTriangle === -1 || selectedTriangle === 24) && game.eaten[color].length !== 0 && game.moves.find(m => selectedTriangle + k * m === point)) {
            if (game.state[point].length < 2 || game.state[point].includes(color)) {
                makeMove(point, color, k)
            }
        }
        else if ((selectedTriangle === -1 || selectedTriangle === 24) && game.state[point].includes(color) && game.eaten[color].length === 0) {
            setSelectedTriangle(point)
        }
        else if ((selectedTriangle !== -1 && selectedTriangle !== 24) && game.moves.find(m => selectedTriangle + k * m === point)) {
            if (game.state[point].length < 2 || game.state[point].includes(color)) {
                makeMove(point, color, k)
            }

        }
        else if (point === selectedTriangle) {
            setSelectedTriangle(game.whiteTurn ? -1 : 24)
        }

        else if ((selectedTriangle === -1 || selectedTriangle === 24) && game.eaten[color].length !== 0 && !game.moves.find(m => game.state[selectedTriangle + k * m].includes(color) || game.state[selectedTriangle + k * m].length < 2)) {
            const updatedGame = { ...game, moves: [], whiteTurn: !game.whiteTurn }
            updateGame(updatedGame)
        }
    }

    const endTurn = () => {
        const updatedGame = { ...game, whiteTurn: !game.whiteTurn, moves: [] }
        setSelectedTriangle(updateGame.whiteTurn ? -1 : 24)
        updateGame(updatedGame)
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

    return (
        <div className="container">
            <div className="container" style={boardStyle}>
                <div className="row" style={sideStyle}>
                    {game.state.filter((s, i) => i < 12).reverse().map((s, i) => <Triangle key={11 - i} game={game} selectedTriangle={selectedTriangle} checkers={s} point={11 - i} handleTriangleClick={handleTriangleClick} />)}
                </div>
                <div className="row" style={sideStyle} >
                    {game.state.filter((s, i) => i >= 12).map((s, i) => <Triangle key={i + 12} game={game} selectedTriangle={selectedTriangle} checkers={s} point={i + 12} handleTriangleClick={handleTriangleClick} />)}
                </div>
            </div >
            <Dices game={game} updateGame={updateGame} />
            { readyForTakingHome(game.whiteTurn ? 'w' : 'b',) ?
                <div className="container">
                    <button onClick={endTurn}>end turn</button>
                    <button onClick={() => setSelectedTriangle(game.whiteTurn ? -1 : 24)}>reset triangle selection</button>
                </div> : null}
        </div >
    )
}

export default Board