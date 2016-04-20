'use strict';

var platforms = require('../controllers/platforms');

module.exports = function(app, express) {

	var router = new express.Router();


	router.get('/test/:platformId/:gameId',platforms.test);

	router.get('/platform/:id', platforms.read);


	return router;
};