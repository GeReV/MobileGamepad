module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.main %>',
        dest: 'build/<%= pkg.main.replace(".js", "") %>.min.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '',
          cssDir: 'build',
          environment: 'production'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'compass']);

};