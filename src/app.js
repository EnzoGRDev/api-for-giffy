require('dotenv').config()
require('./database')
const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./routes/users')
const favoritesRouter = require('./routes/favorites')

app.use(cors({
  origin : ["http://127.0.0.1:3000","http://localhost:3000", "192.168.2.206", "*"]
}))
app.use(express.json())
app.use('/users', usersRouter)
app.use('/favorites', favoritesRouter)

module.exports = app