var bodyParser  = require('body-parser'), 	// get body-parser
    User        = require('../models/user'),
    jwt         = require('jsonwebtoken'),
    http        = require('http'),
    config      = require('../config'),
	async 		= require('async'),
	_ 			= require('lodash');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = new express.Router();

	apiRouter
		.get('/platform/:id', function(req, res){

			var fieldList = 'id,name';
			var options = {
				host: config.GBAPI.host,
				path: '/api/platform/'+ encodeURI(req.params.id) +
					  '/?api_key=' + config.GBAPI.apiKey +
					  '&format=' + config.GBAPI.format +
					  '&field_list=' + fieldList,
				headers: config.GBAPI.headers
			};

			callback = function(response){
				var str = '';
				response.on('data', function(chunk){
					str += chunk;
				});

				response.on('end', function(){
					res.json(JSON.parse(str).results);
				})
			};

			http.request(options,callback).end();
		})
		.get('/test/:platformid/:gameid', function (req, res)
		{
			var userData = {};
			var output = {};
			var tmp = {};
			async.series([
				// Load user to get userId first
				function(callback){
					User.findOne({"username": "demouser"}, function(err, user){
						if(err){ return callback(err)}
						//var user = user;
						userData.games = user.library.games;
						userData.platforms = user.library.platforms;
						callback();
					});
				},

				// get platform data from GiantBomb API

				function(callback){
					var fieldList = 'id,name';
					var options = {
						host: config.GBAPI.host,
						path: '/api/platform/'+ encodeURI(req.params.id) +
							  '/?api_key=' + config.GBAPI.apiKey +
							  '&format=' + config.GBAPI.format +
							  '&field_list=' + fieldList,
						headers: config.GBAPI.headers
					};
					var str = '';

					// TODO: fix api lookup
					callback = function(response) {

						response.on('data', function (chunk) {
							str += chunk;
						});

						response.on('end', function () {
							return JSON.parse(str).results;
						});
					};

					tmp.platform = http.request(options, callback).end();

					// tmp.platform = {"id": 30, "name": "PlayStation"};
					callback();
				},

				// check if platform already exists in collection, if not, add to output
				function(callback){
					tmp.found = false;
					for(var key in userData.platforms){
						if(req.params.platformid == userData.platforms[key].id){
							tmp.found = true;
							break;
						}
					}
					callback();
				}
			],function(err){
				if(!tmp.found){
					userData.platforms.push(tmp.platform);
					output.message = "Game added to the database";
				}
				if(err){return res.send(err)}

				res.json(output);
			});
		});
	return apiRouter;
};