module.exports = function(grunt){

	 // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/js/<%= pkg.name %>.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/js/<%= pkg.name %>.min.js'
      },
    },
    concat: {
	  options: {
	    separator: ';'
	  },
	  dist: {
	    src: ['src/jquery-1.7.1.min.js','src/jquery.mousewheel-min.js','src/jquery.terminal-min.js'],
	    dest: 'build/js/<%= pkg.name %>.lib.min.js'
	  }
	}
    /*concat: {
      	'build/library.js':['src/jquery-1.7.1.min.js','src/jquery.mousewheel-min.js','src/jquery.terminal-min.js']
      }*/
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');


  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};