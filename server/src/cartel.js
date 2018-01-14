const axios = require('axios')
exports.cartel = async (client) => {
	const cartel = axios.create({
		baseURL: 'localhost:3000'
	})
	const dealer = await cartel.post('/', client)
	return dealer
}
