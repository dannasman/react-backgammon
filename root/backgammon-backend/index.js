const express = require('express')
const session = require('express-session')
const redis = require('redis')
const connectRedis = require('connect-redis')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const connect = require('connect')
const cors = require('cors')
require('express-async-errors')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const socketRoutes = require('./routes/socket')
const httpRoutes = require('./routes/games')
const GameStore = require('./lib/GameStore')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const DB = new GameStore()

const server = http.createServer(app)
const io = require('socket.io')(server, {
	cors: {
		origin: config.ORIGIN,
		credentials: true
	}
})

const RedisStore = connectRedis(session)

const redisClient = redis.createClient({
	host: config.REDIS_HOST,
	port: config.REDIS_PORT
})

redisClient.on('error', (err) => {
	console.log(`Could not establish a connection with redis. ${err}`)
})

redisClient.on('connect', (err) => {
	console.log('Connected to redis successfully')
})

const sessionStore = new RedisStore({ client: redisClient })

const sessionMiddleware = session(
	{
		store: sessionStore,
		secret: config.SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: false,
			maxAge: 1000 * 60 * 10
		}
	}
)

app.use(sessionMiddleware)

io.use((socket, next) => {
	const data = socket.request
	const sessionCookie = cookie.parse(data.headers.cookie)
	if (sessionCookie) {
		const sessionID = cookieParser.signedCookie(sessionCookie['connect.sid'],
			config.SECRET)
		sessionStore.get(sessionID, (err, session) => {
			if (err || !session) {
				next(new Error('not authorized'))
			}
			else {
				data.session = session
				data.sessionID = sessionID
				next()
			}
		})
	}
	else {
		next(new Error('no cookie found'))
	}
})

httpRoutes(app, DB)
socketRoutes(io, DB)

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})

// TJ 76 2.4.2021