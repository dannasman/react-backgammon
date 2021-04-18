const _ = require('underscore');

class Game {

    constructor() {
        this.status = 'pending'

        this.activePlayer = null

        this.players = [
            { color: null, name: null, joined: false, forfeited: false, startingDices: 0 },
            { color: null, name: null, joined: false, forfeited: false, startingDices: 0 }
        ]

        this.board = [
            "ww",
            "",
            "",
            "",
            "",
            "bbbbb",
            "",
            "bbb",
            "",
            "",
            "",
            "wwwww",
            "bbbbb",
            "",
            "",
            "",
            "www",
            "",
            "wwwww",
            "",
            "",
            "",
            "",
            "bb"
        ]

        this.home = {
            "w": "",
            "b": "",
        }
        this.eaten = {
            "w": "",
            "b": "",
        }

        this.selectedTriangle = -1

        this.moves = []

        this.modifiedOn = Date.now()
    }

    addPlayer(playerData) {
        if (!this.players[0].joined) {
            this.players[0].name = playerData.playerName
            this.players[0].color = playerData.playerColor
            this.players[0].joined = true
        }

        else if (this.players[0].joined) {
            this.players[1].name = playerData.playerName
            this.players[1].color = this.players[0].color === 'w' ? 'b' : 'w'
            this.players[1].joined = true
            this.activePlayer = this.players[0]
            this.status = 'ongoing'
        }

        else if (this.players[0].joined && this.players[1].joined) { return false }


        this.modifiedOn = Date.now()

        return true
    }

    removePlayer(playerData) {

        let p = _.findWhere(this.players, { name: playerData.playerName })
        if (!p) { return false }

        p.joined = false

        this.modifiedOn = Date.now()

        return true

    }

    forfeit(playerData) {
        let p = _.findWhere(this.players, { color: playerData.color })

        if (!p) { return false }

        p.forfeited = true

        this.status = 'forfeit'

        this.modifiedOn = Date.now()

        return true
    }

    rollDice(playerData) {

        if (!this.players[0].joined || !this.players[0].joined) { return false }

        let p = _.findWhere(this.players, { name: playerData.name })
        if (p.color !== this.activePlayer.color) { return false }

        this.moves = playerData.moves

        this.modifiedOn = Date.now()

        return true

    }

    readyForTakingHome(color) {
        const start = this.activePlayer.color === 'w' ? 0 : 6
        const end = this.activePlayer.color == 'w' ? 17 : 23
        const notHome = this.board.slice(start, end + 1)
        return !notHome.find(p => p.includes(color)) && this.eaten[color].length === 0
    }

    takeHome(point, color, k) {
        const helper = this.activePlayer.color === 'w' ? 23 : 0
        this.board[point] = this.board[point].slice(0, -1)
        this.home[color] += color
        this.moves.splice(this.moves.findIndex(m => m === (helper - point * k + 1)), 1)

        if (this.moves.length === 0) {
            this.changeActivePlayer()
        }

        this.selectedTriangle = this.activePlayer.color === 'w' ? -1 : 24
    }

    makeMove(point, color, k) {

        if (this.eaten[color].length === 0) {
            this.board[this.selectedTriangle] = this.board[this.selectedTriangle].slice(0, -1)
        }

        if (this.eaten[color].length > 0) {
            this.eaten[color] = this.eaten[color].slice(0, -1)
        }

        if (!this.board[point].includes(color) && this.board[point].length === 1) {
            this.board[point] = this.board[point].slice(0, -1)
            const opponent = this.activePlayer.color === 'w' ? 'b' : 'w'
            this.eaten[opponent] += opponent
        }

        this.board[point] += color
        this.moves.splice(this.moves.findIndex(m => m === (point - this.selectedTriangle) * k), 1)

        if (this.moves.length === 0) {
            this.changeActivePlayer()
        }
        this.selectedTriangle = this.activePlayer.color === 'w' ? -1 : 24
    }

    handleMove(point) {
        const color = this.activePlayer.color
        const k = color === 'w' ? 1 : -1
        const helper = color === 'w' ? 23 : 0

        if (this.readyForTakingHome(this.activePlayer.color)) {
            if ((this.selectedTriangle === -1 || this.selectedTriangle === 24) && this.board[point].includes(color)) {
                this.selectedTriangle = point
            }
            else if (point === this.selectedTriangle && this.moves.find(m => m === helper - point * k + 1)) {
                this.takeHome(point, color, k)
            }
            else if ((this.selectedTriangle !== -1 && this.selectedTriangle !== 24) && this.moves.find(m => this.selectedTriangle + k * m === point)) {
                if (this.board[point].length < 2 || this.board[point].includes(color)) {
                    this.makeMove(point, color, k)
                }
            }
        }
        else if ((this.selectedTriangle === -1 || this.selectedTriangle === 24) && this.eaten[color].length !== 0 && this.moves.find(m => this.selectedTriangle + k * m === point)) {
            if (this.board[point].length < 2 || this.board[point].includes(color)) {
                this.makeMove(point, color, k)
            }
        }
        else if ((this.selectedTriangle === -1 || this.selectedTriangle === 24) && this.board[point].includes(color) && this.eaten[color].length === 0) {
            this.selectedTriangle = point
        }
        else if ((this.selectedTriangle !== -1 && this.selectedTriangle !== 24) && this.moves.find(m => this.selectedTriangle + k * m === point)) {
            if (this.board[point].length < 2 || this.board[point].includes(color)) {
                this.makeMove(point, color, k)
            }

        }
        else if (point === this.selectedTriangle) {
            this.selectedTriangle = this.activePlayer.color === 'w' ? -1 : 24
        }

        else if ((this.selectedTriangle === -1 || this.selectedTriangle === 24) && this.eaten[color].length !== 0 &&
            !this.moves.find(m => this.board[this.selectedTriangle + k * m].includes(color) || this.board[this.selectedTriangle + k * m].length < 2)) {

            this.changeActivePlayer()
            this.selectedTriangle = this.selectedTriangle === -1 ? 24 : -1
        }

        this.modifiedOn = Date.now()
    }

    resetSelection() {
        this.selectedTriangle = this.activePlayer.color === 'w' ? -1 : 24
    }

    endTurn() {
        this.changeActivePlayer()
    }

    changeActivePlayer() {
        var inactivePlayer = _.find(this.players, function (p) {
            return (p === this.activePlayer) ? false : true;
        }, this);
        this.moves = []

        this.activePlayer = inactivePlayer
    }

}

module.exports = Game