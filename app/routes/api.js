var bodyParser  = require('body-parser'), 	// get body-parser
    User        = require('../models/user'),
    jwt         = require('jsonwebtoken'),
    http        = require('http'),
    config      = require('../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter
        .get('/test', function(req, res){
			User.find({"username": "demouser"}, function(err, user){
				for(var key in user[0].library.games){
					console.log(user[0].library.games[key]);
				}
			});
        });

	return apiRouter;
};