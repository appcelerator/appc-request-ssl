/**
 * This code is closed source and Confidential and Proprietary to
 * Appcelerator, Inc. All Rights Reserved.  This code MUST not be
 * modified, copied or otherwise redistributed without express
 * written permission of Appcelerator. This file is licensed as
 * part of the Appcelerator Platform and governed under the terms
 * of the Appcelerator license agreement.
 */

// verify from browser at https://www.grc.com/fingerprints.htm

const DOMAINS = [
	'security.appcelerator.com',
	// pre-production
	// 'de7a3ab4b12bf1d3d4b7fde7f306c11bc2b98f67.cloudapp-enterprise-preprod.appctest.com',
	// production
	'4503ef0cc4daae71d3bb898f66c72b886c9f6d61.cloudapp-enterprise.appcelerator.com',
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
