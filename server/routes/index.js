const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// App Routes

router.get('/', mainController.homepage); //This is the home route
router.get('/about', mainController.about); //This is the about route
router.get('/features', mainController.features);//This the features route
//Exporting the router
module.exports = router;
