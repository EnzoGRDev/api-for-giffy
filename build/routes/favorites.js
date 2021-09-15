const authExtractor = require('../middlewares/authExtractor');

const User = require('../models/User');

const Favorite = require('../models/Favorite');

const favoritesRouter = require('express').Router();

favoritesRouter.get('/:username', async (req, res) => {
  const {
    username
  } = req.params;
  const user = await User.findOne({
    username
  });
  if (!user) return res.status(404).end();
  res.json(user.favorites);
});
favoritesRouter.post('/', authExtractor, async (req, res) => {
  const {
    username
  } = req.user;
  const {
    gif_id,
    title,
    image_mid,
    image_high
  } = req.body;
  let newFavorite;
  const user = await User.findOne({
    username
  }).populate('favorites');
  let favorite = await Favorite.findOne({
    gif_id
  });

  if (!favorite) {
    newFavorite = new Favorite({
      gif_id,
      title,
      image_mid,
      image_high,
      users: user._id
    });
    favorite = await newFavorite.save();
  } else {
    const isUserInFav = favorite.users.toString().includes(user._id.toString());

    if (!isUserInFav) {
      favorite.users = favorite.users.concat(user._id);
      newFavorite = await favorite.save();
    }
  }

  let isFavInUser = await user.favorites.toString().includes(favorite._id.toString());
  if (isFavInUser) return res.status(304).json({
    error: "Ya existe usuario y fav"
  });
  user.favorites = user.favorites.concat(favorite._id);
  const userFavsSaved = await user.save();
  res.status(201).json(userFavsSaved.favorites);
});
favoritesRouter.delete('/:favId', authExtractor, async (req, res) => {
  const {
    username
  } = req.user;
  const {
    favId
  } = req.params;
  const user = await User.findOne({
    username
  });
  const favorite = await Favorite.findOne({
    favId
  });

  const reducerUser = (acumulador, elemento) => {
    elemento.toString() === favorite._id.toString() ? null : acumulador.push(elemento);
  };

  const reducerFav = (acumulador, elemento) => {
    elemento.toString() === user._id.toString() ? null : acumulador.push(elemento);
  };

  user.favorites = await user.favorites.reduce(reducerUser, []);
  favorite.users = await favorite.users.reduce(reducerFav, []);
  const userSaver = await user.save();
  const favoriteSaver = await favorite.save();
  res.json(userSaver);
});
module.exports = favoritesRouter;