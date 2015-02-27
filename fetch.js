/**
 * This code is closed source and Confidential and Proprietary to
 * Appcelerator, Inc. All Rights Reserved.  This code MUST not be
 * modified, copy or otherwise redistributed without expression
 * written permission of Appcelerator. This file is licensed as
 * part of the Appcelerator Platform and governed under the terms
 * of the Appcelerator license agreement.
 */
var request = require('request-ssl'),
	path = require('path'),
	fs = require('fs'),
	urlib = require('url'),
	tmpdir = require('os').tmpdir(),
	dir = path.join(tmpdir, 'appc-request-ssl'),
	added;

const APPC_SECURITY_SERVER = process.env.APPC_SECURITY_SERVER || 'https://4503ef0cc4daae71d3bb898f66c72b886c9f6d61.cloudapp-enterprise.appcelerator.com';

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
	if (!added) {
		// tell our request library to use our cached fingerprint directory
		// to locate any fingerprints
		request.addFingerprintDirectory(dir);
		added = true;
	}
	// attempt to read in the etag cached file if it exists
	var etagFn = path.join(dir, '.etag'),
		etag;
	if (fs.existsSync(etagFn)) {
		etag = fs.readFileSync(etagFn).toString().trim();
	}
	var opts = {
		method: 'get',
		url: urlib.resolve(APPC_SECURITY_SERVER,'/ssl-fingerprints'),
		headers: {
			'User-Agent': 'Appcelerator (appc-request-ssl)/'+require('./package.json').version,
			'If-None-Match': etag || ''
		},
		gzip: true
	};
	// send the HTTP request
	request(opts, function(err,resp,body){
		if (err) {
			return callback(new Error("Error fetching SSL certificates. "+err));
		}
		// not modified, no changes from what we have locally so we can just continue
		if (resp.statusCode === 304) {
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