//Requiring modules
require('dotenv').config();

//requiring express (so we can create a express server )
const express = require('express');

//requiring express-ejs-layouts(it is essentially for creating layouts in our app)
const expressLayouts = require('express-ejs-layouts');

const methodOverride = require('method-override');

//requiring mongoose (so we can connect to our database)
const connectDB = require('./server/config/db');

//requiring session
const session = require('express-session');

//requiring passport
const passport = require('passport');

//requring Mongostore
const MongoStore = require('connect-mongo');

//creating a new express app
const app = express();

//Giving it a port number
const port = 8000 || process.env.PORT;

app.use(
  session({
    secret: 'Call of Duty',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { Date: new Date(Date.now() + 3600000) },
  })
);

//Passport config
app.use(passport.initialize());
app.use(passport.session());

//ADDING MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //This is used to parse the data from page to page
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);
  next();
});

//Connecting to the database
connectDB(); //This will connect to the database
//STATIC FILES(middleware)
app.use(express.static('public')); //This is used to serve static files like css,js,images etc(For linking)

//Templating Engine
app.use(expressLayouts); //This is used to create layouts in our app

//Setting the defualt layouts
app.set('layout', './layouts/main'); //setting the default layout to main

app.set('view engine', 'ejs'); //setting the view engine to ejs

//Routes
app.use('/', require('./server/routes/index')); //linking the index.js file in routes folder
app.use('/', require('./server/routes/auth')); //linking the auth.js file in routes folder
app.use('/', require('./server/routes/dashboard')); //linking the Dashboard.js file in routes folder

//HAndles 404
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //This will run when the server is started
});
