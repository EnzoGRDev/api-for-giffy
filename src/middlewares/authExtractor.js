const jwt = require('jsonwebtoken')

module.exports = (req, res, next) =>{
  const auth = req.get('authorization')
  let token = null
  if (auth && auth.toLocaleLowerCase().startsWith('bearer')){
    token = auth.substring(7)
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch{}

  if (!token || !decodedToken) return res.status(401).json("token invalid or missing").end()
  
  req.user = {
    userId : decodedToken.id,
    username : decodedToken.username
  } 
  next()
}