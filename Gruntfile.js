var exec = require('child_process').exec;

module.exports = function(grunt) {

	var tests = ['test/**/*_test.js'];

	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			options: {
				timeout: 3500,
				reporter: 'spec',
				ignoreLeaks: false,
				globals: [
					'requestSSLInitializing',
					'requestSSLInsideHook',
					'requestSSLInitialized'
				]
			},
			src: tests
		},
		appcJs: {
			options: {
				force: false
			},
			src: ['index.js', 'lib/**/*.js', 'test/**/*.js']
		},
		appcCoverage: {
			default_options: {
				src: 'coverage/lcov.info',
				force: true
			}
		},
		kahvesi: { src: tests }
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-appc-js');
	grunt.loadNpmTasks('grunt-kahvesi');
	grunt.loadNpmTasks('grunt-appc-coverage');

	// compose our various coverage reports into one html report
	grunt.registerTask('report', function() {
		var done = this.async();
		exec('./node_modules/grunt-kahvesi/node_modules/.bin/istanbul report html', function(err) {
			if (err) { grunt.fail.fatal(err); }
			grunt.log.ok('composite test coverage report generated at ./coverage/index.html');
			return done();
		});
	});

	grunt.registerTask('cover', ['kahvesi', 'report', 'appcCoverage']);
	grunt.registerTask('test', ['appcJs', 'mochaTest']);
	grunt.registerTask('default', ['test']);

};
