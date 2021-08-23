const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routes = require('./routes/routes.js');

let app = express();

//use view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// For reading HTML data
app.use(express.urlencoded({ extended: false }));

// For accessing external files
app.use(express.static('public'));

// For reading data from external source
app.use(express.json());

// logging using morgan middleware
app.use(morgan('dev'));

//---------------------------------------------------------------------

// Open server and connect database
let db;
let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

let dbURI =
  'mongodb+srv://mattpowell2784:spazmati1Z@cluster0.se05l.mongodb.net/maxVolts?retryWrites=true&w=majority';

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port))
  .catch(err => {
    console.log(err);
  });

//---------------------------------------------------------------------

//routes
app.use(routes);

app.get('/', (req, res) => {
  res.render('index');
});

app.use((req, res) => {
  if (res.status(404)) {
    res.render('404');
  }
});
