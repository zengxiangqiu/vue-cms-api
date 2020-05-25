const jwt = require('jsonwebtoken');
const debug = require('debug')('user');
module.exports = (req, res , next)=>{
  if(req.headers['authorization']){
    let token  = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.SECRET_CODE,function(err, decoded){
      debug(err);
      debug(decoded);
      if(!decoded){
        res.status('401').send({message:'invalid token'});
      }
      else{
        if(decoded.exp<= new Date()/1000)
          res.status('401').send({message:'invalid token'});
        else{
          req.params.user=decoded.user_id;  
          next();
        }
      }
    })
  }
  else{
    res.status('401').send({message:'invalid token'});
  }
}