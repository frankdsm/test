/**
 * Created by Stijn on 20/03/2016.
 */
// grab the pacakges that we need for the user model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('../config'),
	bcrypt = require('bcrypt-nodejs');

// user Schema
var UserSchema = new Schema({
	userID: {
		'type': Number,
		'index': {
			'unique': true
		}
	},
	username: {
		'type': String,
		'required': true,
		'index': {
			'unique': true
		}
	},
	usertype: {
		'type': String,
		'enum': [
			'user', 'admin'
		]
	},
	password: {
		'type': String,
		'required': true,
		'select': false
	},
	firstname: {
		'type': String
	},
	lastname: {
		'type': String
	},
	email: {
		'type': String
	},
	gender: {
		'type': String,
		'enum': [
			'male', 'female', 'undefined'
		]
	},
	bio: {
		'type': String
	},
	avatar: {
		'type': String
	},
	library: {
		platforms: [{
				'id': {
					'type': Number
				}
		}],
		games: [{
			id: {
				'type': Number
			},
			name: {
				'type': String
			},
			platforms: {
				'items': {
					'id': {
						'type': Number
					}
				}
			}
		}]
	},
	friends: [{
		'id': Number,
		'name': String
	}],
	userData: {
		registerDate: Date,
		lastLogon: Date,
		logonCount: Number,
		active: Boolean
	}
});

// hash the password and userID before the user is saved
UserSchema.pre('save', function (next) {
	var user = this;

	// set userID, registration date, usertype and active when new user
	if (user.isModified('username')) {
		var hash = 0, i, char;
		if (user.username.length == 0) return hash;
		for (i = 0; i < user.username.length; i++) {
			char = user.username.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash |= 0; // Convert to 32bit integer
		}
		user.userID = Math.abs(hash).toString().substring(0, 7);
		user.userData.registerDate = new Date();
		user.userData.active = true;
		user.usertype = 'user';
		user.gender = 'undefined';
		user.bio = '';
		user.library = {};
		user.library.platforms = [];
		user.library.games = [];
		user.friends = [];

	}

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);