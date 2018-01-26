const dynamix = require('./dynamix')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const signIn = require('./signIn')
const passport = require('passport')
const cookieSession = require('cookie-session')
const {
	credentials
} = require('./data/cookieSession')
const {
	cartel
} = require('./cartel')

const source = path.resolve(__dirname, '../../client/public/')
const index = path.join(source, '/index.html')
const server = express()
const port = dynamix.port

server.use(morgan('combined'))
server.use(express.json({
	strct: true
}))
server.use(cors())
server.use(express.static(source))
server.set('trust proxy', true)
server.set('trust proxy', 'loopback')
server.use(cookieSession({
	maxAge: credentials.age,
	keys: credentials.keys
}))
server.use(passport.initialize())
server.use(passport.session())
server.get('/', (req, res) => {
	res.sendFile(index)
})

server.get('/authenticate', (req, res) => {
	res.redirect('/signIn')
})
server.get('/validate', (req, res) => {
	res.send(req.user ? true : false)
})

server.get('/signIn', passport.authenticate('google', {
	'scope': ['profile']
}))

server.get('/signIn/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/')
});
server.get('/signOut', (req, res) => {
	req.logout()
	res.redirect('/')
})
server.post('/', async (req, res) => {
	console.log('Recieved POST\n', req.body)
	const data = await cartel(req.body)
	res.send(data)
})

server.listen(port, console.warn(`Listening on ${port}`))
