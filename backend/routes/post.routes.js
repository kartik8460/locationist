const express = require('express');
const multer = require('multer');

const Post = require('../models/post.model');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP_IMAGES = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
}
const MIME_TYPE_MAP_VIDEOS = {
  'video/mp4': 'mp4',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === 'images'){
      const isValid = MIME_TYPE_MAP_IMAGES[file.mimetype];
      let error = new Error('Invalid mime type of Image');
      if (isValid) {
        error = null;
      }
      cb(error, 'backend/media/images');
    }
    else {
      const isValid = MIME_TYPE_MAP_VIDEOS[file.mimetype];
      let error = new Error('Invalid mime type of Video');
      if (isValid) {
        error = null;
      }
      cb(error, 'backend/media/videos');
    }
  },
  filename: (req, file, cb) => {
    if(file.fieldname === 'images') {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP_IMAGES[file.mimetype];
      cb(null, name+ '-' + Date.now() + '.' + ext);
    } else {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP_VIDEOS[file.mimetype];
      cb(null, name+ '-' + Date.now() + '.' + ext);
    }
  }
});

router.post("", checkAuth, multer({storage: storage}).fields([{name:'images', maxCount: 10}, {name:'videos', maxCount: 5}]), (req, res, next) => {
  let videoPaths = [];
  let imagePaths = [];
  if(req.files['images']){
    for (let i = 0; i<req.files['images'].length ; i++){
      imagePaths.push(req.protocol + '://' + req.get("host") + '/images/' + req.files['images'][i].filename);
    }
  }
  if(req.files['videos']){
    for (let i = 0; i<req.files['videos'].length; i++){
      videoPaths.push(req.protocol + '://' + req.get("host") + '/videos/' + req.files['videos'][i].filename);
    }
  }
  console.log(req.body)
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    locationId: req.body.locationId,
    imagesPaths: imagePaths,
    videosPaths: videoPaths,
    creatorId: req.userData.userId
  })
  post.save().then(result => {
    res.status(201).json({
      message: result,
    });
  })
  .catch(err => {
    console.log('Err is ', err);
    res.status(401).json({
      message:'Error Occured' + err,
    });
  });
});


router.put("/:id", checkAuth, multer({storage: storage}).fields([{name:'images', maxCount: 10}, {name:'videos', maxCount: 5}]), (req, res, next) => {
  let image_Paths = [];
  let video_Paths = [];
  console.log(req.body);
  req.body.imagesPaths ? typeof req.body.imagesPaths === 'string' ? image_Paths.push(req.body.imagesPaths) : image_Paths = req.body.imagesPaths : null;
  req.body.videosPaths ? typeof req.body.videosPaths === 'string' ? video_Paths.push(req.body.videosPaths) : video_Paths = req.body.videosPaths : null;
  if (req.files['images']) {
    for (let i = 0; i<req.files['images'].length ; i++){
      image_Paths.push(req.protocol + '://' + req.get("host") + '/images/' + req.files['images'][i].filename);
    }
  }
  if (req.files['videos']) {
    for (let i = 0; i<req.files['videos'].length; i++){
      video_Paths.push(req.protocol + '://' + req.get("host") + '/videos/' + req.files['videos'][i].filename);
    }
  }

  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    locationId: req.body.locationId,
    imagesPaths: image_Paths,
    videosPaths: video_Paths,
    creatorId: req.userData.userId
  })

  console.log('Post ', post);
  Post.updateOne({ _id: req.params.id, creatorId: req.userData.userId }, post).then(result => {
    if (result.nModified >= 0) {
      res.status(200).json({ message: 'Post Updated Successfully', result: result });
    } else {
      res.status(401).json({message: 'Not Authorized!!'})
    }
  })
});

router.get('',(req, res, next) => {
  Post.find().populate('locationId', 'name').populate('creatorId', 'name first_name last_name profile_pic').
  then(documents => {
    res.status(200).json(documents);
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json ({message: 'Post Not found'});
    };
  });
});

router.get('/by-location/:locationId', (req, res, next) => {
  Post.find({locationId: req.params.locationId}).populate('creatorId', 'first_name last_name profile_pic')
  .then(result => {
    if(!result){
      throw('Invalid Request')
    }
    res.status(200).json({success: true, result: result});
  })
  .catch(err => {
    res.status(400).json({success: false, message: err});
  })
})

router.get('/by-user/:userId', (req, res, next) => {
  Post.find({creatorId: req.params.userId}).populate('locationId', 'name')
  .then(result => {
    if(!result){
      throw('Invalid Request');
    }
    res.status(200).json({success: true, result: result});
  })
  .catch(err => {
    res.status(400).json({success: false, message: err});
  })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creatorId: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Post Delete Successfully', result:result });
    } else {
      res.status(401).json({message: 'Not Authorized!!'})
    }
  });
});

module.exports = router;
