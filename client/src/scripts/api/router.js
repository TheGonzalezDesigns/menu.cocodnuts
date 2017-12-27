/*global exports*/
import axios from 'axios'

function validateStatus(status) {
	return status >= 200 && status < 300
}

function handleError(error) {
	let statusIsValid = true
	if (error.response) {
		let status = error.response.status
		console.warn(error.response.data)
		console.warn(status)
		console.warn(error.response.headers)
		statusIsValid = validateStatus(status)
	} else if (error.request) console.warn(error.request)
	else console.warn('Error', error.message)
	console.warn(error.config)
	return statusIsValid
}

function requestMenu(route) {
	let req = {
		res: '',
		valid: true
	}
	axios.get(route)
		.then(res => req.res = res)
		.catch(err => req.valid = handleError(err))
	return req
}

function updateMenu(data) {
	let req = {
		res: '',
		valid: true
	}
	axios.post('/publish', data)
		.then(res => console.log(res))
		.catch(err => req.valid = handleError(err))
	return req.valid
}

exports.requestMenu = requestMenu
exports.updateMenu = updateMenu
