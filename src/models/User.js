const {Schema, model} = require('mongoose')

// const userSchema = new Schema({
//   name: String,
//   username: String,
//   password: String,
//   favorites: [{  
//     favID : String,
//     title : String,
//     images : [{
//       image_mid: String,
//       image_high: String
//     }]
//   }]
// })

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  favorites : [{
    type: Schema.Types.ObjectId,
    ref: 'Favorite'
  }]
})


userSchema.set('toJSON',{
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const User = model('User', userSchema)

module.exports = User