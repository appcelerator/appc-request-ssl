/**
 * This code is closed source and Confidential and Proprietary to
 * Appcelerator, Inc. All Rights Reserved.  This code MUST not be
 * modified, copied or otherwise redistributed without express
 * written permission of Appcelerator. This file is licensed as
 * part of the Appcelerator Platform and governed under the terms
 * of the Appcelerator license agreement.
 */

// always load our bundled request-ssl, not one up the food chain.
var request = require('request-ssl'),
	path = require('path');

// load up the fingerprints from our local directory
request.addFingerprintDirectory(path.join(__dirname, 'fingerprints'));

// fall back to support a fingerprint list from ENV
// these should overwrite any built in ones.  this is useful
// if we need to field augment any fingerprints or add customer specific
// fingerprints such as for VPC or Private Cloud
if (process.env.APPC_FINGERPRINT_DIRECTORY) {
	request.addFingerprintDirectory(process.env.APPC_FINGERPRINT_DIRECTORY);
}

// register a request initializer function that will fetch our latest AppC fingerprints
request.registerInitializer(function (callback) {
	var fetch = require('./fetch');
	fetch(function (err) {
		if (err) {
			console.error('Error fetching Appcelerator SSL fingerprints. ' + err);
		}
		if (callback) { return callback(); }
	});
});

// expose our domains, helpful in testing
request.APPC_DOMAINS = require('./generate').DOMAINS;

module.exports = request;
