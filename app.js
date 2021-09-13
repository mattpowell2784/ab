const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const morgan = require('morgan');
const addRoutes = require('./routes/addRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

//read config.env file
dotenv.config({ path: './config.env' });
//console.log(process.env);

//initailise express
let app = express();

//use view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// For reading HTML data
//app.use(express.urlencoded({ extended: false }));

// For accessing external files
app.use(express.static('public'));

// For reading data from external source
app.use(express.json());

//cookie parser
app.use(cookieParser());

// logging using morgan middleware
app.use(morgan('dev'));

//---------------------------------------------------------------------

// Open server and connect database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//---------------------------------------------------------------------

//routes
app.use(addRoutes);
app.use(userRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.use((req, res) => {
  if (res.status(404)) {
    res.render('404');
  }
});

// app.all('*', (req, res) => {
//   console.log(req);
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server`,
//   });
// });
