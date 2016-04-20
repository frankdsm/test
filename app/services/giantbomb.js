'use strict';

var bodyParser = require('body-parser'), 	// get body-parser
  User = require('../models/user'),
  jwt = require('jsonwebtoken'),
  http = require('http'),
  config = require('../config'),
  async = require('async'),
  _ = require('lodash'),
  request = require('request'),
  qs = require('querystring');

function getPlatform(platformId, callback) {
  // super secret for creating tokens
  var superSecret = config.secret;
  var query = qs.stringify({
    api_key: config.GBAPI.apiKey,
    format: config.GBAPI.format,
    field_list: 'id,name'
  });

  var url = 'http://' + config.GBAPI.host + '/api/platform/' + encodeURI(platformId) + '/?' + query;
  request.get({ url: url, headers: config.GBAPI.headers, json: true }, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    callback(null, body.results);
  });
}



module.exports = {
  getPlatform: getPlatform
};