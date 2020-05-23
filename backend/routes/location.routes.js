const express = require('express')
const Location = require('../models/location.model');

const router = express.Router();

router.post('/add-location', (req, res, next) => {
  console.log(req.body)
  const location = new Location({
    name : req.body.name,
    description : req.body.description,
    address : {
      line_1: req.body.address.line_1,
      line_2: req.body.address.line_2,
      city: req.body.address.city,
      state_ut: req.body.address.state_ut,
      zipcode: req.body.address.zipcode
    },
    loc:{
      type: req.body.loc.type,
      coordinates:[req.body.loc.longitude, req.body.loc.latitude]
    },
    phone_number : req.body.phone_number,
    location_type : req.body.location_type,
    location_website : req.body.location_website
  })
  location.save()
  .then(result => {
    console.log(result);
    res.json({ success: true, message: result })
  })
  .catch(err=> {
    res.json({ success: false, message: err });
    console.log(err);
  })
})

router.get('/search-location/:searchkey', (req, res, next) => {
  if(req.params.searchkey){
    let searchKey = '^'+req.params.searchkey;
    console.log(searchKey,'SearchhKey')
    const regex  = new RegExp(searchKey);
    Location.find({name: { $regex: regex, $options: 'i' }}, {name: 1})
    .then(result =>{
      res.json({ success: true, result: result})
    })
    .catch(err => {
      res.json({ success: false, error: err})
    })
  }
  else{
    res.json({err:'Enter A valid Key'})
  }
})

router.get('/near-by/:long/:lat', (req, res, next) => {
  const lat = parseFloat(req.params.lat);
  const long = parseFloat(req.params.long);
  console.log(lat,long)
  Location.find({ loc: { $near: { $maxDistance: 50000, $geometry: {type: "Point", coordinates: [long, lat]} } } }, {address: 1, loc:1, name:1})
  .then(result =>{
    res.json({ success: true, result: result})
  })
  .catch(err => {
    console.log('err', err);
    res.json({ success: false, message: err})
  })
})

router.get('/location-details/:locationId', (req, res, next) => {
  Location.findById({_id: req.params.locationId })
  .then(result =>{
    res.json({ success: true, result: result })
  })
  .catch(err => {
    console.log('err', err);
    res.json({ success: false, message: err})
  })
})

router.get('/location-preview/:locationId', (req, res, next) => {
  Location.findById({_id: req.params.locationId }, {name: 1, cover_pic: 1, address: 1, location_type: 1})
  .then(result =>{
    res.json({ success: true, result: result})
  })

  .catch(err => {
    res.json({ success: false, message: err})
  })
})

router.post('/advance-search', (req, res, next) => {
 let location_query = {};

  if(req.body.searchKey) {
    location_query = {"$text":{
      "$search": req.body.searchKey
    }};
  }

  if (req.body.location_type) {
  location_query["location_type"]= req.body.location_type;
  }

  if (req.body.state_ut) {
  location_query["address.state_ut"]= req.body.state_ut;
  }

  if (req.body.city) {
  location_query["address.city"]= req.body.city;
  }

  console.log(location_query)

  Location.find(location_query)
  .then(result => {
    res.status(200).json({ success: true, result: result })
  }).catch(err => {
    res.json({ success: false, message: err})
  })
})

module.exports = router;
