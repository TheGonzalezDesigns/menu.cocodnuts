/*global exports*/
import axios from 'axios'

function checkStatus(res, error, log = true) {
	if (res.status >= 200 && status < 300) {
		if (log) {
			console.warn(res.data)
			console.warn(res.status)
			console.warn(res.headers)
		}
		return true
	} else {
		if (log) {
			if (error.response) {
				console.warn(error.response.data)
				console.warn(error.response.status)
				console.warn(error.response.headers)
			} else if (error.request) console.warn(error.request)
			else console.warn('Error', error.message)
			console.warn(error.config)
		}
		return false
	}
}

function requestMenu(route) {
	let req = {
		res: '',
		err: '',
		valid: true
	}
	axios.get(route)
		.then(res => req.res = res)
		.catch(err => req.err = err)

	req.valid = checkStatus(req.res, req.err)

	return req
}

function updateMenu(data) {
	let req = {
		res: '',
		err: '',
		valid: true
	}
	axios.post('/publish', data)
		.then(res => req.res = res)
		.catch(err => req.err = err)

	req.valid = checkStatus(req.res, req.err)

	return req
}

exports.requestMenu = requestMenu
exports.updateMenu = updateMenu
