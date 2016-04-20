'use strict';

var async = require('async');
var User = require('../models/user');
var giantbomb = require('../services/giantbomb');

function read(req, res, next) {

  giantbomb.getPlatform(req.params.id, function onGet(err, platform) {
    res.json(platform);
  });
}

function test(req, res, next) {

  var userData = {};
  var output = {};
  var tmp = {};

  async.waterfall([
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

    function (callback) {
      giantbomb.getPlatform(req.params.id, callback);
    },

    // check if platform already exists in collection, if not, add to output
    function(platform, callback){
      tmp.found = false;
      for(var key in userData.platforms){
        if(req.params.platformid == userData.platforms[key].id){
          tmp.found = true;
          break;
        }
      }
      callback();
    }
  ], function (err) {
    if(err){return res.send(err)}
    if(!tmp.found){
      userData.platforms.push(tmp.platform);
      output.message = "Game added to the database";
    }


    res.json(output);
  });
}

module.exports = {
  read: read,
  test: test
};
