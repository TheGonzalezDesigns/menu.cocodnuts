const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const handle = require('./handle.js')
const server = express()

server.use(morgan('combined'))
server.use(bodyParser.json())
server.use(cors())

server.get('/getData', (req, res) => {
	res.send(handle.get())
})

server.post('/publish', (req, res) => {
	res.send(handle.publish({
		"menu": req.body.menu
	}))
})

server.listen(process.env.PORT || 8081)
