import React from 'react'
import { Link } from 'react-router-dom'

const Boards = ({ games, updateGame, createPlayer }) => {
    return (
        <div className="container">
            {games.map(game =>
                <div key={game.id}>
                    {game.players.length < 2 ? <Link to={`/games/${game.id}`} onClick={() => createPlayer(game)}>{game.players.length}/2</Link> : null}
                </div>
            )
            }
        </div >
    )
}

export default Boards