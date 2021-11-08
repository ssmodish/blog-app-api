// Import dependencies
// - brings in all of the modules we'll be using
require('dotenv').config()
const cors = require('cors')

const postsRouter = require('./posts/posts.router')

const express = require('express')

// Create and instance of an express app
// - create the actual server object
const server = express()

// Connect the app to global middleware
// - functions that every endpoint passes through
server.use(cors())
server.use(express.json())

// Endpoints check connection and perform functions
// - the code that sends and receives messages and determines what to do
server.use('/api/posts', postsRouter)

server.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the Server' })
})

// Listen to or export server
// - what the rest of the world connects to
module.exports = server
