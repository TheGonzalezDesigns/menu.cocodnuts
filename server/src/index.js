const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {
	cartel
} = require('./cartel')
const server = express()
const source = '../client/public/' // ./ = menu.cocodnuts/server/

server.use(cors)
server.use(morgan('combined'))
server.use(express.json({
	strct: true
}))
server.use(express.static(source))
server.set('trust proxy', true)
server.set('trust proxy', 'loopback')

server.get('/', (req, res) => {
	res.sendFile(source + 'index.html')
})
/*

server.get('/test', (req, res) => {
	console.log('testing')
	res.send("It's alive")
})
*/

server.post('/', (req, res) => {
	console.log('Request Recieved!')
	const data = cartel(req.body)
	res.send(data)
})

server.listen(8081)
