exports.port = 8081
exports.cors = {
	options: (origin, callback) => {
		const whitelist = [
			'http://localhost:8081',
			'http://localhost:8888',
			'http://menu.cocodnuts.com',
			'https://menu.cocodnuts.com',
			'https://accounts.google.com']
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}
