import React from 'react'
import Checker from './Checker'

const Triangle = ({ game, checkers, point, selectedTriangle, handleTriangleClick }) => {

    const k = game.activePlayer.color === 'w' ? 1 : -1
    const color = game.activePlayer.color
    let isHighlighted = (((game.selectedTriangle !== -1 && game.selectedTriangle !== 24) || game.eaten[color].length > 0) && (game.board[point].includes(color) || game.board[point].length < 2))
        ? (game.moves.find(m => m * k + selectedTriangle === point) ? "300px solid green" : "300px solid #855E42")
        : "300px solid #855E42" //lol wtf
    isHighlighted = game.selectedTriangle === point ? "300px solid orange" : isHighlighted
    const triangleStyle = {
        width: 50,
        height: 300,
        padding: 0,
        //paddingBottom: point >= 12 ? 5 : 0,
        margin: 0,
        position: 'relative',
        display: "flex",
        flexDirection: point >= 12 ? "column-reverse" : "column",
        borderStyle: "solid",
        borderLeft: "25px solid transparent",
        borderRight: "25px solid transparent",
        borderBottom: point < 12 ? "0px solid transparent" : isHighlighted,
        borderTop: point < 12 ? isHighlighted : "0px solid transparent"
    }

    return (
        <div className="col" style={triangleStyle} onClick={() => handleTriangleClick(point)}>
            {checkers.split("").map((c, i) => <Checker key={i} checker={c} point={point} />)}
        </div>
    )
}

export default Triangle