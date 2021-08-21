const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ClientsModel = require('./models/clients');
const session = require('express-session');
const flash = require('connect-flash');

//const ClientModel = require('./models/clients');

let sessionsOptions = session({
  secret: 'JavaScript is a cool language!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

let app = express();

//use view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//enable cookies
app.use(sessionsOptions);
app.use(flash());

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
let port = 3000;

let dbURI =
  'mongodb+srv://mattpowell2784:spazmati1Z@cluster0.se05l.mongodb.net/maxVolts?retryWrites=true&w=majority';

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => {
    console.log(err);
  });

//---------------------------------------------------------------------

//routes

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/all-clients', (req, res) => {
  ClientsModel.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/add-client', (req, res) => {
  const resJson = JSON.parse(JSON.stringify(req.body));
  console.log(resJson);
  const newClient = new ClientsModel(resJson);
  newClient
    .save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      req.flash('errors', 'max characters exceeded');
      req.session.save(() => {
        res.render('index', { errors: req.flash('errors') });
      });
      //res.send(err);
      //console.log(err);
    });
});

app.post('/patch/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);
  let data = req.body;
  ClientsModel.findByIdAndUpdate(
    //{ _id: new mongodb.ObjectId(id) },
    id,
    { $set: data },
    () => {
      res.redirect('/');
    }
  );
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  ClientsModel.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.use((req, res) => {
  if (res.status(404)) {
    res.render('404');
  }
  //res.status(404).sendFile('./views/404.ejs', { root: __dirname });
});
