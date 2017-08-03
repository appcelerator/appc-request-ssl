var exec = require('child_process').exec;

module.exports = function(grunt) {

	var tests = ['test/**/*_test.js'];

	// Project configuration.
	grunt.initConfig({
		mocha_istanbul: {
			coverage: {
				src: tests,
				options: {
					timeout: 3500,
					reporter: 'mocha-jenkins-reporter',
					reportFormats: ['lcov', 'cobertura'],
					ignoreLeaks: false,
					globals: [
						'requestSSLInitializing',
						'requestSSLInsideHook',
						'requestSSLInitialized'
					]
				}
			}
		},
		appcJs: {
			options: {
				force: false
			},
			src: ['index.js', 'lib/**/*.js', 'test/**/*.js']
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-appc-js');
	grunt.loadNpmTasks('grunt-mocha-istanbul');

	grunt.registerTask('test', ['appcJs', 'mocha_istanbul:coverage']);
	grunt.registerTask('default', ['test']);

};
