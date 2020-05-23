const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require("./routes/user.routes");
const locationRoutes = require("./routes/location.routes");
const postRoutes = require("./routes/post.routes");
const reviewRoutes = require("./routes/review.routes");

const db="mongodb+srv://kartik:Kartik@8460@cluster0-5likk.mongodb.net/test2?retryWrites=true&w=majority";
const app = express();

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true  }, err => {
  if (err) {
      console.error(err);
  }
  else {
      console.log('Connected to Mongodb');
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("./backend/media/images")));
app.use("/videos", express.static(path.join("./backend/media/videos")));
app.use("/default", express.static(path.join("./backend/media/default")));
app.use("/cover", express.static(path.join("./backend/media/cover")));
app.use("/profile", express.static(path.join("./backend/media/profile")));
app.use("/location", express.static(path.join("./backend/media/location-cover")));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader(
    'Access-Control-Allow-Methods',
  "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use('/', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/post', postRoutes);
app.use('/api/review', reviewRoutes);

module.exports = app;
