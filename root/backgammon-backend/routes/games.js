var DB = null

const startGame = (req, res) => {

    if (!req.body.playerColor) { return res.status(401).json({ error: 'player has no color' }) }

    if (req.body.playerColor !== 'w' && req.body.playerColor !== 'b') { return res.status(401).json({ error: 'player has no proper color' }) }

    if (req.body.playerName === '') { return res.status(401).json({ error: 'player has no name' }) }

    const gameID = DB.add()

    req.session.gameID = gameID
    req.session.playerColor = req.body.playerColor
    req.session.playerName = req.body.playerName
    return res.status(201).json({ gameID: gameID })
}

const game = (req, res) => {

    if (!req.session.gameID) { return res.status(401).json({ error: 'game ID not found' }) }
    if (!req.session.playerColor) { return res.status(401).json({ error: 'player color not found' }) }
    if (!req.session.playerName) { return res.status(401).json({ error: 'player name not found' }) }
    if (!req.params.id) { return res.status(401).json({ error: 'parameter id not provided' }) }

    if (req.session.gameID !== req.params.id) { return res.status(401).json({ error: 'session and parameter game IDs do not match' }) }

    return res.status(201).json({
        gameID: req.session.gameID,
        playerColor: req.session.playerColor,
        playerName: req.session.playerName
    })
}

const joinGame = (req, res) => {
    if (!req.body.gameID) { return res.status(401).json({ error: 'game ID not found' }) }
    if (req.body.gameID === '') { return res.status(401).json({ error: 'game ID is whitespace' }) }
    if (req.body.playerName === '') { return res.status(401).json({ error: 'player name not found' }) }

    const game = DB.find(req.body.gameID)

    if (!game) { return res.status(401).json({ error: 'game not found' }) }

    const joinColor = game.players[0].joined ? game.players[1].color : game.players[0].color

    req.session.gameID = req.body.gameID
    req.session.playerColor = req.body.playerColor
    req.session.playerName = req.body.playerName

    return res.status(201).json({
        gameID: req.session.gameID,
        playerColor: joinColor,
        playerName: req.session.playerName
    })
}

const invalid = (req, res) => {

    res.redirect('/')
}

module.exports = (app, db) => {
    DB = db

    app.get('/game/:id', game)
    app.post('/start', startGame)
    app.post('/join', joinGame)
    app.all('/*', invalid)
}