const authExtractor = require('../middlewares/authExtractor')
const User = require('../models/User')
const Favorite = require('../models/Favorite')
const favoritesRouter = require('express').Router()

favoritesRouter.get('/:username', async (req,res)=>{
  const {username} = req.params
  const user = await User.find({username}).populate('favorites')

  if (!user) return res.status(404).json({error:"no existe usuario"})

  res.status(200).json(user)
})

favoritesRouter.post('/', authExtractor, async (req, res)=>{
  const {username} = req.user 
  const {gif_id, title, image_mid, image_high} = req.body
  let newFavorite  
  let user = await User.find({username}).populate('favorites')
  let favorite = await Favorite.find({gif_id}).populate('users')
  user = user[0]
  favorite = favorite[0]


  if (!favorite) {
    newFavorite = new Favorite({
      gif_id,
      title,
      image_mid, 
      image_high,
      users : user._id
    })
    favorite = await newFavorite.save()
  }else {
    const isUserInFav = favorite 
      ? await favorite.users.toString().includes(user._id.toString()) 
      : null
    if (!isUserInFav) {
      favorite.users = favorite.users.concat(user._id)
      newFavorite = await favorite.save()
    }
  }
  
  let isFavInUser = user ? await user.favorites.toString().includes(favorite._id.toString()) : null

  if (isFavInUser) return res.status(304).json({error: "Ya existe usuario y fav"})

  user.favorites = user.favorites.concat(favorite._id)
  const userFavsSaved = await user.save()
  let newsFavoritesOfUser = await User.find({username}).populate("favorites")
  newsFavoritesOfUser = newsFavoritesOfUser[0]

  res.status(201).json(newsFavoritesOfUser.favorites)
})

favoritesRouter.delete('/:favId', authExtractor, async (req, res)=>{
  const {username} = req.user
  const {favId} = req.params
  let user = await User.find({username})
  let favorite = await Favorite.find({gif_id:favId})
  user = user[0]
  favorite = favorite[0]

  if (!favorite) return res.status(404).json({error:"no existe el favorito"})

  const filterUser = (userFav) => userFav.toString() !== favorite._id.toString()

  const filterFav = (favUser) => favUser.toString() !== user._id.toString()

  user.favorites = await user.favorites.filter(filterUser)
  favorite.users = await favorite.users.filter(filterFav)
  const userSaved = await user.save()
  const favoriteSaved = await favorite.save()
  let newsFavoritesOfUser = await User.find({username}).populate("favorites")
  newsFavoritesOfUser = newsFavoritesOfUser[0]

  res.json(newsFavoritesOfUser.favorites)
})

module.exports = favoritesRouter