const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if(!token) return res.status(401).json('Unauthorize user')

   try{
        const decoded = jwt.verify( token , process.env.SECRET );
        console.log(decoded)
        req.user = decoded
        next()

   }catch(e){
    console.log(e)
    res.status(400).json('Token not valid')
   }
}

const verifyTokenAndAuthorization = async (req, res, next)=>{
    await verifyToken(req, res, () =>{
        if(req.user.id === parseInt( req.params.id)|| req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json('You are not allowed!')
        }
    }) 
}
const canAccessBy = (...allowedPermissions) => {
    return async (req, res, next) => {
      const authHeader = req.headers['authorization'];
  
      if (!authHeader) {
        return res.sendStatus(401);
      }
  
      const token = authHeader.split(' ')[1];
  
      await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.sendStatus(401); // invalid token
        }
  
        const userCache = await cacheService.getOneUser(decoded.id);
        
        if (!userCache || !userCache.permissions) {
          return res.sendStatus(403); // unauthorized
        }
  
        const permissionArray = [...allowedPermissions];
        const result = userCache.permissions.map((item) => permissionArray.includes(item)).find((val) => val === true);
  
        if (!result) {
          return res.sendStatus(403);
        }
  
        next();
      });
    };
  };
module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    canAccessBy
}