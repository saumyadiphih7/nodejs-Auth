const jwt = require('jsonwebtoken')


const authMiddleware = (req, res, next) => { 
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }

  if(!token){
    res.status(401)
    throw new Error('Not authorized, no token')
  }
    
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
 
module.exports = authMiddleware;
  

