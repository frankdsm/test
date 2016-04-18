var bodyParser = require('body-parser'), 	// get body-parser
	User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	http = require('http'),
	config = require('../config'),
	async = require('async'),
	_ = require('lodash');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

	var apiRouter = new express.Router();

	apiRouter
		.get('/test', function (req, res) {



			function getUser(cb) {
					User.findOne({ "username": "demouser" }, cb);
			}

			function getGamesOfFriends(user, cb) {

				if (!user.friends) {
					return res.status(404).send('No friends found');
				}
				var friendIds = _.map(user.friends, 'id');
				var ownGames = _.map(user.library.games, 'name');

				User.find({
					'userID': { $in: friendIds },
					'library.games.name': { $in: ownGames }
				}, cb);
			}

			async.waterfall([
				getUser,
				getGamesOfFriends
			], function onFinish(err, result) {
				if (err) return res.status(400).send('Bad request');

				res.json(result);
			});
		});

	return apiRouter;
};