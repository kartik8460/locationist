const jwt = require('jsonwebtoken');
const scretKey = 'secret_this_should_be_longer';

module.exports = (req,res,next) => {
  if(!req.headers.authorization) return res.status(401).json({ success:false, message:'Invalid Token Request' });

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, scretKey);
    console.log(decodedToken);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }
    next();
  }
  catch(error) {
    if(error.name = 'TokenExpiredError'){
      return res.status(401).json({success: false, message: 'Token Expired'});
    }
    res.status(401).json({ success:false, message:'Invalid Token Request' });
  }
}
