const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const EmailVerification = require('../models/emailVerification.model');
const User = require('../models/user.model');

const emailService = require('./../middleware/email-service');
const checkAuth = require('./../middleware/check-auth');

const router = express.Router();
const MIME_TYPE_MAP_IMAGES = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let isValid = MIME_TYPE_MAP_IMAGES[file.mimetype];
    let error = new Error('Invalid mime type of Image');
    if(isValid){
      error = null;
    }
    if(file.fieldname === 'cover_pic'){
      cb(error, 'backend/media/cover');
    }
    if(file.fieldname === 'profile_pic'){
      cb(error, 'backend/media/profile');
    }
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP_IMAGES[file.mimetype];
    cb(null, name+ '-' + Date.now() + '.' + ext);
  }
})

const scretKey = 'secret_this_should_be_longer';
const emailVerificationSecretKey ="secretkey_for_email_verification";


function emailPatternMatch(email) {
  const emalPattern = /^(([^<>()[\]\\.,;: \s@\']+(\.[^<>()[\]\\.,;: \s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emalPattern.test(email);
}

/********************************************************************** Registration ***********************************************************************/
router.post('/register', (req, res, next) => {
  if( !req.body.email || !req.body.password || !req.body.name){
    return res.status(401).json({ success: false, message: 'Email or Password or Name is Missing' });
  }

  const isEmailValid = emailPatternMatch(req.body.email);
  if( !isEmailValid){
    return res.status(401).json({ success: false, message: 'Email not valid' });
  }
  const url = req.protocol + '://' + req.get("host");

  let random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      first_name: req.body.name.split(' ')[0],
      last_name: req.body.name.split(' ')[1],
      password: hash,
      isVerified: false,
      cover_pic: `${url}/default/default-cover-${random}.jpg`,
      profile_pic: `${url}/default/default-profile-${random}.jpg`
    })
    return user.save();
  })
  .then(result => {
    console.log(result);
    res.status(201).json({ success: true, messgae: 'User Created', userId: result._id });
    req.emailServiceData = {
      userName: result.first_name,
      userEmail: result.email,
      subject: `${result.first_name}, Welcome to Locationist`,
      serviceType: 1
    }
    next();
  })
  .catch(err => {
    console.log(err)
    if(err.name === 'ValidationError'){
      return res.status(400).json({ success: false, message: 'Email already registered'})
    }
    return res.status(500).json({ sucess: false, message: err.message })
  })
}, emailService);

/********************************************************************** Login ***********************************************************************/
router.post('/login', (req, res, next) => {
  let fetchedUser;

  if( !req.body.email || !req.body.password){
    return res.status(401).json({ success: false, message: 'Email or Password Missing' });
  }

  const isEmailValid = emailPatternMatch(req.body.email);
  if( !isEmailValid){
    return res.status(401).json({ success: false, message: 'Email is Invalid' });
  }

  User.findOne({ email: req.body.email})
  .then(user => {
    if (!user){
      throw('Email Not Registered');
    }

    else if(!user.isVerified) {
      throw({ success: false, message:'Account Not Verified', userId: user._id})
    }

    else{
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    }
  })
  .then(result=> {
    if( !result) {
      throw('Incorrect Password');
    }
    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, scretKey, { expiresIn: '7d' } );
    res.status(200).json({ success: true, message:'Successfull Login', token: token, userId: fetchedUser._id, expiresIn: 604800, isVerified: fetchedUser.isVerified, profile_pic: fetchedUser.profile_pic, user_name: fetchedUser.first_name});
  })
  .catch(err => {
    console.log(err)
    if(err.message === 'Account Not Verified'){
      return res.status(200).json(err);
    }
    return res.status(401).json({ success: false, message: err });
  });
});

/********************************************************************** Get Profile ***********************************************************************/
router.get('/user-details/:id', (req ,res, next) => {
  userId = req.params.id
  User.findOne({_id: userId},{password: 0, __v: 0})
  .then(result => {
    if(!result) {
      throw('Failed')
    }
    res.status(200).json({ success: true, message: result })
  })
  .catch(err => {
    return res.status(400).json({success: false, message: 'No User Found' })
  })
})

/********************************************************************** Edit Profile ***********************************************************************/
/*** Main Profile ***/
router.put('/edit-profile/main', checkAuth, (req, res, next) => {
  let user;

  user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
    from: req.body.from,
    gender: req.body.gender,
    phone_no: req.body.phone_no,
    about: req.body.about,
  }
  User.updateOne({_id: req.body._id}, user)
  .then(result => {
    console.log(result)
    res.status(201).json({success: true, message: 'Successfully Updated Your Profile'})
  })
  .catch(err => {
    res.status(500).json({success: false, message: 'Some Error Occured'})
  })
})

/*** Social Accounts ***/
router.put('/edit-profile/social', checkAuth, (req, res, next) => {
  let user = {
    social: req.body.social
  }
  User.updateOne({_id: req.body._id}, user)
  .then(result => {
    if(!result){
      throw('Some error Occured')
    }
    res.status(201).json({success: true, message: 'Successfully Updated Your Social Accounts'})
  })
  .catch(err => {
    res.status(500).json({success: false, message: 'Some Error Occured'})
  })
})

/*** Change Password ***/
router.put('/change-password', checkAuth, (req,res, next) => {
  let fetchedUser;
  if(req.body.current_password === req.body.new_password){
    return res.status(401).json({ success: false, message: 'Your current Password Cannot be your New Password'})
  }

  User.findOne({_id: req.body._id},{password: 1, first_name: 1, email: 1 })
  .then(user => {
    console.log(user);
    if(!user){
      throw('Inavlid Request')
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.current_password, user.password)
  })
  .then(result => {
    if(!result) {
      throw('Your Current Password is Invalid')
    }
    return bcrypt.hash(req.body.new_password, 10)
  })
  .then(hash => {
    User.updateOne({_id: req.body._id},{password: hash}, (err, result)=> {
      if(result.nModified > 0) {
        res.status(201).json({ success: true, message: 'You have Successfully changes your password '});
        req.emailServiceData = {
          userName: fetchedUser.first_name,
          userEmail: fetchedUser.email,
          subject: `${fetchedUser.first_name}, Changed Password`,
          serviceType: 4
        }
        next();
      }
      else {
        throw('Some Error occured');
      }
    })
  })
  .catch(err => {
    res.status(401).json({ success: false, message: err })
  })

},emailService)

/*** Update Cover Photo ***/
router.put('/cover-pic', checkAuth, multer({storage: storage}).single('cover_pic'), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let user = {
    cover_pic: `${url}/cover/${req.file.filename}`
  }
  User.updateOne({_id: req.body._id},user,(err, result) => {
    if(result.n > 0) {
      return res.status(201).json({success: true, message: 'Successfully Updated Cover photo', cover_pic: user.cover_pic})
    }
  })
})

/*** Update Profile Photo ***/
router.put('/profile-pic', checkAuth, multer({storage: storage}).single('profile_pic'), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let user = {
    profile_pic: `${url}/profile/${req.file.filename}`
  }
  User.updateOne({_id: req.body._id},user,(err, result) => {
    if(result.n > 0) {
      return res.status(201).json({success: true, message: 'Successfully Updated Cover photo', profile_pic: user.profile_pic})
    }
  })
})

/********************************************************************** Forgot Password ***********************************************************************/

router.post('/forgetPassword', (req, res, next) => {
  if( req.headers.authorization ) {
    return res.status(401).json({ success: false, message: 'UserLoggedIn' });
  }

  if( !req.body.email ) {
    return res.status(401).json({ success: false, message: 'Please Provide your Email' });
  }

  const isEmailValid = emailPatternMatch(req.body.email);
  if( !isEmailValid){
    return res.status(401).json({ success: false, message: 'Email is Invalid' });
  }

  User.findOne({ email: req.body.email})
    .then(user => {
      if(!user){
       throw('Email is not registered' );
      }
      const secretKey = user.password + user.createdAt.getTime();
      const token = jwt.sign({ userId: user._id}, secretKey, {expiresIn: '1d'});
      const url = `http://localhost:4200/reset-password/${user._id}/${token}`;
      res.status(200).json({success: true, message: 'You should soon receive an email allowing you to reset your password. Link will expires in 24hrs Please make sure to check your spam and trash if you can\'t find the email.'});
      req.emailServiceData = {
        userName: user.first_name,
        userEmail: user.email,
        subject: 'Reset Password Request',
        serviceType: 2,
        resetPasswordUrl: url
      }
      next();
    })
    .catch(err => {
      return res.status(401).json({ success: false, message: err });
    });
}, emailService)

router.post('/reset-password/verify-token' , (req,res, next) => {
  if( !req.body.token || !req.body.userId){
    return res.status(400).send({ success: false, message: 'Invalid Url Requested' });
  }
  User.findOne({ _id: req.body.userId})
  .then( user => {
    if( !user){
      throw('Invalid Url Requested');
    }
    const secretKey = user.password + user.createdAt.getTime();
    jwt.verify(req.body.token, secretKey, (error, result) => {
      if (error) {
        if( error.name == 'TokenExpiredError') {
          throw('TokenExpiredError');
        }
          throw('Invalid Url Requested');
      }
      res.status(200).json({ success: true, message: 'Token Verified' });
    });
  })
  .catch(err => {
    if(err.name === 'CastError') {
      return res.status(403).json({ success: false, message: 'Invalid Request' });
    }
    if(err == 'TokenExpiredError' ){
      return res.status(403).json({ success: false, message: 'Link expired please request a new one.' });
    }
    return res.status(401).json({ success: false, message: err });
  });
});

router.post('/reset-password-data', (req, res, next) => {
  if( !req.body.token || !req.body.userId){
    return res.status(400).send({ success: false, message: 'Invalid Url Requested' });
  }

  let fetchedUser;
  let decodedToken;
  User.findOne({ _id: req.body.userId})
  .then(user => {
    if( !user){
      throw new Error('InvalidToken');
    }
    fetchedUser = user;
    const secretKey = user.password + user.createdAt.getTime();
    jwt.verify(req.body.token, secretKey, (error, result) =>{
      if (error) {
        if( error.name === 'TokenExpiredError') {
          throw('TokenExpiredError');
        }
        throw('Invalid Url Requested');
      }
      decodedToken = result
    })
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(result){
      throw('samePassword');
    }
    return bcrypt.hash(req.body.password, 10)
  })
  .then(hash =>{
    User.updateOne({ _id: decodedToken.userId},{password: hash})
      .then(saved => {
        console.log('saved ', saved);
        res.status(201).json({ success: true, message: 'Password Changed' });
        User.findOne({ _id: decodedToken.userId}, (error,user) =>{
          req.emailServiceData = {
            userName: user.first_name,
            userEmail: user.email,
            subject: 'Password Reset Successfully',
            serviceType: 3
          }
          next();
        });
      })
  })
  .catch(err => {
    console.log('error', err)
    if(err === 'TokenExpiredError' ){
      return res.status(401).json({ success: false, message: 'Link expired please request a new one.' });
    }
    if(err === 'samePassword' ){
      return res.status(401).json({ success: true, message: 'Your current Password cannot be your new Password' });
    }
    return res.status(401).json({ success: false, message: 'Invalid Url Requested' });
  });
}, emailService)

/********************************************************************** Verify Email ***********************************************************************/

router.post('/verify-email-request', (req, res, next) => {
  const userId = req.body.userId;
  if( !userId){
    return res.status(401).json({ success: false, message: 'Invalid Request' });
  }

  User.findOne({ _id: userId})
    .then(user => {
      console.log(user);
      if(!user || user.isVerified){
       throw('Invalid Request');
      }
      const token = jwt.sign({message: 'Email verification Link'}, emailVerificationSecretKey, {expiresIn: '1d'});
      const url = `http://localhost:3000/verify-email/${token}`;
      emailVerification = new EmailVerification({
        userId: userId,
        token: token
      })
      emailVerification.save();
      res.status(200).json({success: true, message: 'Please Verify Account your accout to Login.You should soon receive an email allowing you to verify your account. Link will expires in 24hrs Please make sure to check your spam and trash if you can\'t find the email.'});
      req.emailServiceData = {
        userName: user.first_name,
        userEmail: user.email,
        subject: `${user.first_name} Confirm your Locationist Account`,
        serviceType: 5,
        emailVeficiationUrl: url
      }
      next();
    })
    .catch(err => {
      return res.status(401).json({ success: false, message: err });
    });
}, emailService)

router.get('/verify-email/:token', (req, res, next) => {
  const token = req.params.token;

  EmailVerification.findOne({token: token})
    .then(result => {
      if(!result){
        throw('Invalid Url');
      }
      console.log('RESSSSSSSSSSSSSSSSSSSSSSSSSULTTTTTTTTTTTTTTTTTTTTTT');
      res.redirect('http://localhost:4200/login;query=accountVerified')
      EmailVerification.deleteMany({userId: result.userId}).then(result => console.log(result));
      User.findOneAndUpdate({_id: result.userId},{isVerified: true}, {new: true}, (err, user)=> {
        console.log(user)
        req.emailServiceData = {
          userName: user.first_name,
          userEmail: user.email,
          subject: `${user.first_name} Sucessfull Email Verification`,
          serviceType: 6,
        }
        next();
      });
    })
    .catch(err => {
      return res.status(400).send({err});
    })
}, emailService)


module.exports = router;
