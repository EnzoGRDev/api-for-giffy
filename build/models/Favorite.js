const {
  Schema,
  model
} = require('mongoose');

const favoriteSchema = new Schema({
  gif_id: String,
  title: String,
  image_mid: String,
  image_high: String,
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});
favoriteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
const Favorite = model('Favorite', favoriteSchema);
module.exports = Favorite;