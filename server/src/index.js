const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const handle = require('./handle.js')
const server = express()

const public = '../client/public/' //./ = menu.cocodnuts/server/

server.use(morgan('combined'))
server.use(bodyParser.json())
server.use(cors())
server.use(express.static(public))
server.set('trust proxy', true)
server.set('trust proxy', 'loopback')

server.get('/', (req, res) => {
	res.sendFile(__dirname + '/' + public + 'index.html')
})

server.get('/getData', (req, res) => {
	res.send(handle.get())
})

server.post('/publish', (req, res) => {
	res.send(handle.publish({
		"menu": req.body.menu
	}))
})

server.listen(8081)
