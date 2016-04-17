/**
 * Created by Stijn on 20/03/2016.
 */
module.exports = {
	'port'  : process.env.PORT || 1234,
	'GBAPI' : {
		'host'      : 'www.giantbomb.com',
		'apiKey'    : '05e8a2387dc079d44fb4e6b268af8d807d70ad04',
		'format'    : 'json',
		'path'      : '/api',
		'headers'   : {
			'user-agent': '<PGDB>'
		}
	},
	'mongo': {
		'prefix': 'mongodb://',
		'user'  : 'pgdb',
		'pass'  : 'pgdb',
		'uri'   : 'ds013320.mlab.com:13320',
		'db'    : 'pgdb'
	},
	'secret': 'thesecrettohashthepasswordsforthepgdb'
};