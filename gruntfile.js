/* jshint camelcase: false */

'use strict';


module.exports = function (grunt) {


	// Load grunt tasks automatically
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-develop');
	grunt.loadNpmTasks('grunt-jasmine-node-coverage');


	// Define the configuration for all the tasks
	grunt.initConfig({


		// Watches files for changes and runs tasks based on the changed files
		watch: {
			//allJs: {
				//files: ['server/**/*.js', 'tests/**/*.js'],
				//tasks: ['jasmine_node', 'jshint'],
				//options: {nospawn: false}
			//},
			serverJs: {
				files: ['server/**/*.js'],
				tasks: ['develop'],
				options: {nospawn: true}
			}
		},


		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish'),
				force: true
			},
			all: [
				'gruntfile.js',
				'server/**/*.js',
				'tests/**/*.js'
			]
		},


		// Run the node server
		develop: {
			server: {
				file: 'server/testServer.js',
				nodeArgs: ['--debug=5859']
			}
		},


		//
		jasmine_node: {
			coverage: {

			},
			options: {
				forceExit: true,
				match: '.',
				matchall: false,
				extensions: 'js',
				specNameMatcher: 'Spec'
			}
		},


		// shell commands
		// jasmine-node tests/e2e --autotest --watch server --captureExceptions
		shell: {
			jasmineOnce: {
				command: 'jasmine-node tests/spec --forceexit',
				options: {
					stdout: true
				}
			},
			jasmineWatch: {
				command: 'jasmine-node tests/spec --autotest --watch server --captureExceptions',
				options: {
					stdout: true
				}
			},
			deploy: {
				command: 'modulus deploy --project-name globe-staging',
				options: {
					stdout: true
				}
			},
			deployLive: {
				command: 'modulus deploy --project-name globe',
				options: {
					stdout: true
				}
			}
		}
	});


	grunt.registerTask('jasmine', [
		'jasmine_node'
	]);

	grunt.registerTask('serve', [
		'develop',
		'watch'
	]);

	grunt.registerTask('default', [
		'shell:jasmineOnce'
	]);

	grunt.registerTask('deploy', [
		'shell:deploy'
	]);

	grunt.registerTask('deployLive', [
		'shell:deployLive'
	]);
};