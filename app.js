const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routes = require('./routes/routes.js');
const dotenv = require('dotenv');

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
app.use(routes);

app.get('/', (req, res) => {
  res.render('index');
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
