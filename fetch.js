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
	path = require('path'),
	fs = require('fs'),
	urlib = require('url'),
	tmpdir = require('os').tmpdir(),
	dir = path.join(tmpdir, 'appc-request-ssl'),

	// set the appropriate security server for loading the certificates based on the environment
	securityServer = process.env.APPC_SECURITY_SERVER ? process.env.APPC_SECURITY_SERVER :
					process.env.APPC_ENV==='preproduction' || process.env.NODE_ENV==='preproduction' ?
					'https://de7a3ab4b12bf1d3d4b7fde7f306c11bc2b98f67.cloudapp-enterprise-preprod.appctest.com' :
					'https://4503ef0cc4daae71d3bb898f66c72b886c9f6d61.cloudapp-enterprise.appcelerator.com';

/**
 * this function will fetch the SSL fingerprints from the security server for all
 * the necessary AppC authorized domains and will cache them locally. If will check
 * for any new certs each time this method is called, however, will only pull down
 * new ones if there are any changes from what we already have cached.
 */
function fetch(callback) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	// attempt to read in the etag cached file if it exists
	var etagFn = path.join(dir, '.etag'),
		etag;
	if (fs.existsSync(etagFn)) {
		etag = fs.readFileSync(etagFn).toString().trim();
	}
	var opts = {
		method: 'get',
		url: urlib.resolve(securityServer,'/ssl-fingerprints'),
		headers: {
			'User-Agent': 'Appcelerator (appc-request-ssl)/'+require('./package.json').version,
			'If-None-Match': etag || ''
		},
		gzip: true
	};

	if (process.env.APPC_CONFIG_PROXY && process.env.APPC_CONFIG_PROXY !== 'undefined') {
		opts.proxy = process.env.APPC_CONFIG_PROXY;
	}

	// send the HTTP request
	request(opts, function(err,resp,body){
		if (err) {
			return callback(new Error("Error fetching SSL certificates. "+err));
		}
		// not modified, no changes from what we have locally so we can just continue
		if (resp.statusCode === 304) {
			request.addFingerprintDirectory(dir);
			return callback(null,null,dir);
		}
		// we received new fingerprints, we need to update our local cache
		if (resp.statusCode === 200) {
			if (!resp.headers.etag) {
				return callback(new Error("Error fetching SSL certificates. The etag header was expected from the server and it was not returned. Please contact Appcelerator Support."));
			}
			// write out the etag
			fs.writeFileSync(etagFn,resp.headers.etag);
			// write out the contents
			body = typeof(body)==='string' ? JSON.parse(body) : body;
			// array of fingerprint entries where the keys are:
			// domain - domain name for the fingerprint
			// fingerprint - the fingerprint for the domain
			for (var c=0;c<body.length;c++) {
				var entry = body[c];
				fs.writeFileSync(path.join(dir, entry.domain), entry.fingerprint);
			}
			request.addFingerprintDirectory(dir);
			callback(null, body, dir);
		}
		else {
			return callback(new Error("Unexpected error fetching SSL certificates ("+resp.statusCode+")"));
		}
	});
}

module.exports = fetch;


if (module.id === ".") {
	fetch(function(err, result, dir){
		console.log(arguments);
	});
}
