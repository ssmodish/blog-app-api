require('dotenv').config()
const express = require('express')

const server = express()

server.get('/', (req, res) => {
  res.json({ message: 'Hello from the Server' })
})

module.exports = server
