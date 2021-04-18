var IO = null
var DB = null

const join = (gameID) => {
    const sess = this.socket.request.session
    const debugInfo = {
        socketID: this.socket.id,
        event: 'join',
        gameID: gameID,
        session: sess
    }

    if (gameID !== sess.gameID) {
        console.log('ERROR: Access Denied', debugInfo)
        this.socket.emit('error', { message: 'You cannot join this game' })
        return
    }

    const game = DB.find(gameID)
    if (!game) {
        console.log('ERROR: Game Not Found', debugInfo)
        this.socket.emit('error', { message: 'Game not found' })
        return
    }

    const result = game.addPlayer(sess)
    if (!result) {
        console.log('ERROR: Failed to Add Player', debugInfo)
        this.socket.emit('error', { message: 'Unable to join a game' })
        return
    }

    this.socket.join(gameID)

    IO.sockets.in(gameID).emit('update', game)

    console.log(`${sess.playerName} joined ${gameID}`)
}

const roll = (data) => {

    const sess = this.socket.request.session

    const debugInfo = {
        socketID: this.socket.id,
        event: 'roll',
        gameID: sess.gameID,
        session: sess
    }

    if (data.gameID !== sess.gameID) {
        console.log('ERROR: Access Denied', debugInfo)
        this.socket.emit('error', { message: 'You have not joined this game' })
        return
    }

    const game = DB.find(data.gameID)
    if (!game) {
        console.log('ERROR: Game not Found', debugInfo)
        this.socket.emit('error', { message: 'Game not found' })
        return
    }

    game.rollDice(data)
    IO.sockets.in(data.gameID).emit('update', game)
    console.log(`${sess.playerName} rolled dice`)
}

const move = (data) => {

    const sess = this.socket.request.session

    const debugInfo = {
        socketID: this.socket.id,
        event: 'move',
        gameID: data.gameID,
        session: sess
    }

    if (data.gameID !== sess.gameID) {
        console.log('ERROR: Access Denied', debugInfo)
        this.socket.emit('error', { message: 'You have not joined this game' })
        return
    }

    const game = DB.find(data.gameID)
    if (!game) {
        console.log('ERROR: Game not Found', debugInfo)
        this.socket.emit('error', { message: 'Game not found' })
        return
    }

    game.handleMove(data.point)

    IO.sockets.in(data.gameID).emit('update', game)
    console.log(`${sess.playerName} made a move`)
}

const forfeit = (gameID) => {

    const sess = this.socket.request.session

    const debugInfo = {
        socketID: this.socket.id,
        event: 'forfeit',
        gameID: gameID,
        session: sess
    }

    if (gameID !== sess.gameID) {
        console.log('ERROR: Access Denied', debugInfo);
        this.socket.emit('error', { message: "You have not joined this game" })
        return
    }


    const game = DB.find(gameID)
    if (!game) {
        console.log('ERROR: Game Not Found', debugInfo)
        this.socket.emit('error', { message: "Game not found" })
        return
    }


    const result = game.forfeit(sess)
    if (!result) {
        console.log('ERROR: Failed to Forfeit', debugInfo)
        this.socket.emit('error', { message: "Failed to forfeit game" })
        return
    }


    IO.sockets.in(gameID).emit('update', game)

    console.log(`${gameID} ${sess.playerName}: Forfeit`)
}

const disconnect = () => {
    const sess = this.socket.request.session
    const debugInfo = {
        socketID: this.socket.id,
        event: 'disconnect',
        session: sess
    }

    const game = DB.find(sess.gameID)
    if (!game) {
        console.log('ERROR: Game Not Found', debugInfo)
        this.socket.emit('error', { message: "Game not found" })
        return
    }

    const result = game.removePlayer(sess)
    if (!result) {
        console.log(`ERROR: ${sess.playerName} failed to leave ${sess.gameID}`);
        return
    }

    console.log(`${sess.playerName} left ${sess.gameID}`);
    console.log(`Socket ${this.socket.id} disconnected`);
}

const resetSelection = (data) => {
    const sess = this.socket.request.session
    const debugInfo = {
        socketID: this.id,
        event: 'resetSelection',
        session: sess
    }

    if (data.gameID !== sess.gameID) {
        console.log('ERROR: Access Denied', debugInfo);
        this.socket.emit('error', { message: "You have not joined this game" })
        return
    }

    const game = DB.find(sess.gameID)
    if (!game) {
        console.log('ERROR: Game Not Found', debugInfo)
        this.socket.emit('error', { message: "Game not found" })
        return
    }

    game.resetSelection()
    IO.sockets.in(data.gameID).emit('update', game)
    console.log(`${sess.playerName} reset selection`)
}

const endTurn = (data) => {
    const sess = this.socket.request.session
    const debugInfo = {
        socketID: this.socket.id,
        event: 'endTurn',
        session: sess
    }

    if (data.gameID !== sess.gameID) {
        console.log('ERROR: Access Denied', debugInfo);
        this.socket.emit('error', { message: "You have not joined this game" })
        return
    }

    const game = DB.find(sess.gameID)
    if (!game) {
        console.log('ERROR: Game Not Found', debugInfo)
        this.socket.emit('error', { message: "Game not found" })
        return
    }

    game.endTurn()
    IO.sockets.in(data.gameID).emit('update', game)
    console.log(`${sess.playerName} ended turn`)
}

module.exports = (io, db) => {
    IO = io
    DB = db

    io.sockets.on('connection', (socket) => {
        this.socket = socket
        socket.on('join', join)
        socket.on('roll', roll)
        socket.on('move', move)
        socket.on('forfeit', forfeit)
        socket.on('disconnect', disconnect)
        socket.on('resetSelection', resetSelection)
        socket.on('endTurn', endTurn)

        console.log(`Socket ${socket.id} connected`)
    })
}