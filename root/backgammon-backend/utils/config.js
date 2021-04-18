require('dotenv').config()

let PORT = process.env.PORT
//let MONGODB_URI = process.env.MONGODB_URI
let ORIGIN = process.env.ORIGIN
let SECRET = process.env.SECRET
let REDIS_HOST = process.env.REDIS_HOST
let REDIS_PORT = process.env.REDIS_PORT
/*if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI
}*/

module.exports = {
    ORIGIN,
    PORT,
    SECRET,
    REDIS_PORT,
    REDIS_HOST
}