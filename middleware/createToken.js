const jwt  = require('jsonwebtoken')

module.exports = function(user_id){
  const token = jwt.sign({user_id: user_id},process.env.SECRET_CODE,{expiresIn: 3600});
  return token;
}