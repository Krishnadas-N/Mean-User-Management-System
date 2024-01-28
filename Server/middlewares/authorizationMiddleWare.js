const jwt = require('jsonwebtoken');
const { CreateError } = require('../Utils/ResponseHandling');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return next(CreateError(403,"Token expired"))
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err)
  
      if (err) return next(CreateError(403,err.message,err))
  
      req.user = user

      if (user.isAdmin) {
        req.isAdmin = true;
    } else {
        req.isAdmin = false;
    }
      next()
    })
  }


  function isAdmin(req,res,next){
    if (req.isAdmin) {
        next();
    } else {
        // User is not an admin, send back an error
        return next(CreateError(403,'Unauthorized access  Admins only' ))
    }
  }

module.exports={authenticateToken,isAdmin}