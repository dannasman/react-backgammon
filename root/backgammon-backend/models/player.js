const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
    color: String,
    myTurn: Boolean,
    diceValues: [Number],
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }
})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player