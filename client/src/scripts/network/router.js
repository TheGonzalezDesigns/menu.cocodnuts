/*global exports*/
import axios from 'axios'

let client = axios.create({
	baseURL: 'http://localhost:8081'
})

function validate(res) {
	return (res) && (res.status >= 200) && (res.status < 300)
}

function requestMenu(callback) {
	client.get('/getData').then(res => callback(res))
}

function updateMenu(data, callback) {
	client.post('/publish', data).then(res => callback(res))
}

exports.validate = validate
exports.requestMenu = requestMenu
exports.updateMenu = updateMenu
