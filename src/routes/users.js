const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/register', async(req, res)=>{
  const {name, username, password} = req.body
  const isUser = await User.findOne({username})
  
  if (isUser) return res.status(401).json({statusMessage:"Usuario Existente"})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    name,
    username,
    password: passwordHash
  })

  newUser.save()
    .then(res.status(201).end())
    .catch(res.status(503).end()) 
})

usersRouter.post('/login', async (req, res)=>{
  const {username, password} = req.body
  const isUser = await User.findOne({username}).populate("favorites")
  const passCorrect = 
    !isUser 
      ? null 
      : await bcrypt.compare(password, isUser.password)
  
  if (!passCorrect) return res.status(404).json({statusMessage:"usuario o contraseña incorrecto"})
  
  const userForToken = {
    id: isUser._id,
    username: isUser.username
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.json({
    name: isUser.name,
    username: isUser.username,
    id: isUser.id,
    token,
    favorites: isUser.favorites
  })
})



module.exports = usersRouter