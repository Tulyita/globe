'use strict';


module.exports = function (grunt) {


	// Load grunt tasks automatically
	//require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-develop');


	// Define the configuration for all the tasks
	grunt.initConfig({


		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['server/**/*.js', 'spec/**/*.js'],
				tasks: ['shell:jasmineOnce', 'jshint', 'develop'],
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
				'spec/**/*.js'
			]
		},


		// Run the node server
		develop: {
			server: {
				file: 'server/testServer.js',
				nodeArgs: ['--debug']
			}
		},


		// shell commands
		shell: {
			jasmineOnce: {
				command: 'jasmine-node spec --forceexit',
				options: {
					stdout: true
				}
			},
			jasmineWatch: {
				command: 'jasmine-node spec --autotest --watch server',
				options: {
					stdout: true
				}
			},
			deploy: {
				command: 'modulus deploy --project-name globe',
				options: {
					stdout: true
				}
			}
		}

	});



	grunt.registerTask('serve', [
		'shell:jasmineOnce',
		'jshint',
		'develop',
		'watch'
	]);

	grunt.registerTask('default', [
		'shell:jasmineOnce'
	]);

	grunt.registerTask('deploy', [
		'shell:deploy'
	]);
};