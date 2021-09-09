require('dotenv').config()
const express = require('express')

const server = express()

server.get('/', (req, res) => {
  res.json({ message: 'Hello from the Server' })
})

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`))
