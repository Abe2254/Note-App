require('dotenv').config();
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const path = require('path');

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Error: MONGO_URI environment variable is not set!');
  process.exit(1); // Exit the app if no MongoDB URI is provided
}

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

// Database connection
connectDB();
app.set("trust proxy", 1);
// Session
app.use(
  session({
    secret: 'Call of Duty',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 3600000, secure: process.env.NODE_ENV === "production" ? true: false,
      httponly: true
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Templating
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/dashboard'));

// 404 Handler
app.get('*', (req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
