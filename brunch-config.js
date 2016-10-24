exports.files = {
	javascripts: {
		joinTo: {
			'vendor.js': /node_modules/,
			'app.js': /^app/
		}
	},
	stylesheets: {
		joinTo: 'app.css'
	},
	templates: {
		joinTo: 'app.js'
	}
};
