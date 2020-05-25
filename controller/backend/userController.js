const {User} = require('../../models/User')
const createToken = require('../../middleware/createToken')
const debug = require('debug')('user');
exports.user_valid_post = async function(req, res){
  debug(req);
  var user = {name : req.body.name, password: req.body.password};
  // debug(user);
  const user_db = await User.findOne({
    where:{name: user.name , password: user.password}
  });

  if(user_db){
    res.status(200).json({
      token: createToken(user_db.name),
      nickname: user_db.nickname
    })
  }
  else{
    res.status(401).send({error:'invalid account or password'});
  }
}