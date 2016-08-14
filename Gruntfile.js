module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assemble: {
            options: {
                assets: 'assets',
                layoutdir: 'views/layouts',
                partials: ['/server/views/partials/**/*.handlebars'],
                helpers: ["server/helpers.js"],
                layout: "server/views/layouts/main.handlebars"
            },
            home: {
                src: ['views/home.handlebars'],
                dest: 'public/home.html'
            }
        },

        concat: {   
            build: {
                src: [
                // All JS in the libs folder
                'public/src/*.js', 
                'server/*.js',
                'server/config/*.js',
                'server/migrations/*.js',
                'server/posts/*.js',
                'server/projects/*.js',
                'server/routes/*.js',
                'server/seeds/*.js',
                'server/toy_problems/*.js',
                'server/views/*.js',
                'server/views/layouts/*.js',
                'server/views/partials/*.js',
                'server/views/shared/*.js'
                ],
                dest: 'public/src/build/production.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'public/js/build/production.js',
                dest: 'public/js/build/production.min.js'
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: "public/style",
                src: ["*.css", "!*.min.css"],
                dest: "public/style",
                ext: ".min.css"
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'public/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/img/'
                }]
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    ['grunt-assemble',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-imagemin',
    "grunt-contrib-cssmin"].forEach(function(task) { grunt.loadNpmTasks(task);});

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'cssmin']);

};