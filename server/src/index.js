const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const handle = require('./handle.js')
const app = express()

//app.use(morgan('combined'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(handle.get())
})

app.get('/getData', (req, res) => {
  res.send(handle.get())
})

app.post('/publish', (req, res) => {
  res.send(handle.publish({"menu": req.body.menu}))
})

app.listen(process.env.PORT || 8081)
