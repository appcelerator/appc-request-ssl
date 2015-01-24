/**
 * This code is closed source and Confidential and Proprietary to
 * Appcelerator, Inc. All Rights Reserved.  This code MUST not be
 * modified, copy or otherwise redistributed without expression
 * written permission of Appcelerator. This file is licensed as
 * part of the Appcelerator Platform and governed under the terms
 * of the Appcelerator license agreement.
 */

// verify from browser at https://www.grc.com/fingerprints.htm

const DOMAINS = [
	// Production domains
	'dashboard.appcelerator.com',
	'api.cloud.appcelerator.com',
	'admin.cloudapp.appcelerator.com',
	'security.cloud.appcelerator.com',
	'software.appcelerator.com',

	// registry and security server which will need to be updated once we move into prod
	'3a3597615eabd843c6a04b5b650778dbe2feb975.cloudapp-enterprise-preprod.appctest.com',
	'9bcfd7d35d3f2ad0ad069665d0120b7a381f81e9.cloudapp.appcelerator.com',
	'de7a3ab4b12bf1d3d4b7fde7f306c11bc2b98f67.cloudapp-enterprise-preprod.appctest.com',
	'4503ef0cc4daae71d3bb898f66c72b886c9f6d61.cloudapp-enterprise.appcelerator.com',

	// Test / Pre-production domains
	'admin.cloudapp-enterprise-preprod.appctest.com',
	'preprod-api.cloud.appctest.com',
	'360-preprod.appcelerator.com',
	'dolphin-api.cloud.appctest.com'
];


// if you run this file from the command line, will generate fresh fingerprints from 
// the DOMAINS array above

// SECURITY WARNING: only run this and trust the responses if you're sure you're not
// in a man in the middle situation. this assumes that the fingerprints returned are
// trusted

if (module.id === ".") {
	var request = require('request-ssl'),
		async = require('async'),
		fs = require('fs'),
		path = require('path'),
		dir = path.join(__dirname,'fingerprints');
	async.eachSeries(DOMAINS, function(domain, cb){
		console.log('-> checking',domain);
		request.getFingerprintForURL(domain, function(err,fingerprint){
			if (err) { return cb(err); }
			if (!domain) { return cb("Couldn't get fingerprint for "+domain); }
			var fn = path.join(dir, domain);
			console.log(domain+' fingerprint => ',fingerprint);
			fs.writeFile(fn, fingerprint, cb);
		});
	}, function(err){
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
}

// export for testing
exports.DOMAINS = DOMAINS;
