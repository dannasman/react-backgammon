import React from 'react'
import Checker from './Checker'

const Triangle = ({ game, checkers, point, selectedTriangle, handleTriangleClick }) => {

    const k = game.whiteTurn ? 1 : -1
    const color = game.whiteTurn ? 'w' : 'b'
    let isHighlighted = (((selectedTriangle !== -1 && selectedTriangle !== 24) || game.eaten[color].length > 0) && (game.state[point].includes(color) || game.state[point].length < 2))
        ? (game.moves.find(m => m * k + selectedTriangle === point) ? "300px solid green" : "300px solid #855E42")
        : "300px solid #855E42" //lol wtf
    isHighlighted = selectedTriangle === point ? "300px solid orange" : isHighlighted
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