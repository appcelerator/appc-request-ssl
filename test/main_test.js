/**
 * This code is closed source and Confidential and Proprietary to
 * Appcelerator, Inc. All Rights Reserved.  This code MUST not be
 * modified, copied or otherwise redistributed without express
 * written permission of Appcelerator. This file is licensed as
 * part of the Appcelerator Platform and governed under the terms
 * of the Appcelerator license agreement.
 */

// jshint -W079
var should = require('should'),
	request = require('../'),
	fs = require('fs'),
	path = require('path'),
	gen = require('../generate');

describe('should be able to validate all the certificates', function () {
	gen.DOMAINS.forEach(function (domain) {
		it('should get fingerprint for ' + domain, function (done) {
			request.getFingerprintForURL(domain, function (err, f) {
				should(err).be.null;
				should(f).be.a.String;
				var fn = path.join(__dirname, '..', 'fingerprints', domain);
				should(fs.existsSync(fn)).be.true;
				should(fs.readFileSync(fn).toString()).be.equal(f);
				done();
			});
		});
	});
	gen.DOMAINS.forEach(function (domain) {
		it('should be able to connect to ' + domain, function (done) {
			var req = request.get('https://' + domain, function (err, resp) {
				should(err).be.null;
				should(resp).be.an.object;
				done();
			});
			req.on('error', done);
			req.on('timeout', function () {
				done('timed out connecting to ' + domain);
			});
		});
	});
});
