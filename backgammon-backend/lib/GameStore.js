var Game = require('./Game')

class GameStore {
    constructor() {
        this.games = {}
        setInterval((games) => {
            for (key in games) {
                if (Date.now() - games[key].modifiedOn > (12 * 60 * 60 * 1000)) {
                    console.log("Deleting game " + key + ". No activity for atleast 12 hours.");
                    delete games[key];
                }
            }
        }, (1 * 60 * 60 * 1000), this.games);
    }

    add(gameParams) {
        let key = ''
        const length = 7
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length

        do {
            for (var i = 0; i < length; i++) {
                key += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
        } while (this.games.hasOwnProperty(key))

        this.games[key] = new Game(gameParams)

        return key
    }

    remove(key) {
        if (this.games.hasOwnProperty(key)) {
            delete this.games[key]
            return true
        }
        else {
            return false
        }
    }

    find(key) {
        return (this.games.hasOwnProperty(key)) ? this.games[key] : false;
    }

}

module.exports = GameStore