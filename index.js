const server = require('./api/server')

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`))
