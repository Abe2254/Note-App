//Requiring modules
require('dotenv').config();

//requiring express (so we can create a express server )
const express = require('express');

//requiring express-ejs-layouts(it is essentially for creating layouts in our app)
const expressLayouts = require('express-ejs-layouts');


//creating a new express app
const app = express();

//Giving it a port number
const port = 8000 || process.env.PORT;

//ADDING MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //This is used to parse the data from page to page

//STATIC FILES(middleware)
app.use(express.static('public')); //This is used to serve static files like css,js,images etc(For linking)

//Templating Engine
app.use(expressLayouts);//This is used to create layouts in our app

//Setting the defualt layouts
app.set('layout', './layouts/main');//setting the default layout to main

app.set('view engine', 'ejs');//setting the view engine to ejs

//Routes
app.use('/', require('./server/routes/index'));//linking the index.js file in routes folder

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //This will run when the server is started
});
