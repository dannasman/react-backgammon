import React, { useState } from 'react'
import './Checker.css'

const Checker = ({ checker, point }) => {
    const checkerStyle = {
        top: point < 12 ? -300 : 300,
        padding: 0,
        margin: 0,
        display: "inline-block",
        position: "relative",
        backgroundColor: checker === 'w' ? 'burlywood' : 'saddlebrown',
        borderRadius: 100,
        width: 30.7815,
        minHeight: 30.7815,
        right: 30.7815 / 2
    }

    return (
        <div className="container" style={checkerStyle} >
        </div>

    )
}

export default Checker