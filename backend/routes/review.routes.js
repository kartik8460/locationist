const express = require('express')
const Review = require('./../models/review.model');
const checkAuth = require('./../middleware/check-auth');

const router = express.Router();

router.post('/add-review', checkAuth, (req, res, next) => {
  let review = new Review({
    rating: req.body.rating,
    userId: req.userData.userId,
    review: req.body.review,
    locationId: req.body.locationId
  });
  review.save()
  .then(result =>{
    console.log(result);
    res.json({success: true, message:'Reviewed Saved'});
  })
  .catch(err => {
    console.log(err);
    res.json({success: false, message:'Some Error Occured'});
  })
})

router.put('/update-review', checkAuth, (req, res, next) => {

  let review = {
    rating: req.body.rating,
    review: req.body.review,
    userId: req.body.userId,
    locationId: req.body.locationId
  };

  Review.updateOne({userId: req.body.userId, locationId: req.body.locationId}, review)
  .then(result => {
    console.log(result);
    res.status(201).json({ success: true, message: 'Review Updated Successfully' })
  })

  .catch(err => {
    console.log(err);
    res.status(401).json( {success: false, message: err} )
  })

})

router.get('/top-reviews', (req, res, next) => {
  Review.find().sort({$natural: -1}).limit(5).populate('locationId', 'name').populate('userId', 'name first_name last_name profile_pic')
  .then(result => res.status(201).json({ success: true, result: result }))
  .catch(err => res.status(201).json({ success: false, err: err }))
})


router.get('/by-location/:locationId', (req, res, next) => {
  Review.find({locationId: req.params.locationId}).populate('userId', 'first_name last_name profile_pic')
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
  Review.find({userId: req.params.userId}).populate('locationId', 'name')
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

router.get('/by-user-location/:userId,:locationId', (req, res, next) => {
  console.log(req.params.userId, req.params.locationId)
  Review.findOne({userId: req.params.userId, locationId: req.params.locationId})
  .then(result => {
    if(!result){
      throw('notFound');
    }
    res.status(200).json({success: true, result: result});
  })
  .catch(err => {
    console.log(err)
    if(err === 'notFound'){
      console.log(err, 'errrr')
      res.status(200).json({sucess: false, message: err});
    }
    else{
      res.status(400).json( { success: false, message: err } )
    }
  })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  Review.deleteOne({_id: req.params.id, userId: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Review Delete Successfully', result:result });
    } else {
      res.status(401).json({message: 'Not Authorized!!'})
    }
  });
});


module.exports = router;
