module.exports = {
	files: {
		javascripts: {
			joinTo: {
				'app.js': /node_modules/,
				'app.js': /^app/
			}
		},
		stylesheets: {
			joinTo: 'app.css'
		},
		templates: {
			joinTo: 'app.js'
		}
	},
	plugins: {
		htmlPages: {},

		 less: {
		// 	modules: true
		 },
		
		postcss: {
			processors: [
				require('autoprefixer')(['last 2 versions'])
			]
		},
		cssnano: {
			autoprefixer: {
				add: true
			}
		}
	}
};
