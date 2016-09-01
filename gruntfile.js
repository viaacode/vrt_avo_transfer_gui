
var grunt = require("grunt");  
  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  sass: {
      dist: {
       src: [
         'app/scss/styles.scss',
       ],
       dest: 'app/public/css/styles.css',
     }
  },
  copy: {
    main: {
      files: [
        {expand: false, src: ['node_modules/basscss/css/basscss.css'], dest: 'app/scss/_basscss.scss', filter: 'isFile'},
        {expand: false, src: ['node_modules/vue/dist/vue.js'], dest: 'app/public/js/vue.js', filter: 'isFile'},
        {expand: false, src: ['node_modules/chart.js/dist/Chart.js'], dest: 'app/public/js/chart.js', filter: 'isFile'},
        {expand: false, src: ['node_modules/moment/min/moment.min.js'], dest: 'app/public/js/moment.js', filter: 'isFile'},

        {expand: true, cwd:'app/js', src: '**/*', dest: 'app/public/js'},
        {expand: true, cwd:'app/assets', src: '**/*', dest: 'app/public/assets'},
        {expand: true, cwd:'app/fonts', src: '**/*', dest: 'app/public/fonts'},

      ],
    },
  },  
  jshint: {
    all: ['app/js/*.js']
  },
  concat: {
    options: {
      // define a string to put between each file in the concatenated output
      //separator: ';'
    },
    dist: {
      // the files to concatenate
      src: ['app/js/concat/*.js'],
      // the location of the resulting JS file
      dest: 'app/dist/scripts.js'
    }
  },
  watch: {
    css: {
      files: 'app/scss/*.scss',
      tasks: ['sass']
    },
    scripts: {
        files: 'app/js/*.js',
        tasks: ['jshint', 'copy']
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.registerTask('default',['copy', 'sass', 'jshint']);


