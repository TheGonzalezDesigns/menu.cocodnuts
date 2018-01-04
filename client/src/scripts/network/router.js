/*global exports*/
import axios from 'axios'

let client = axios.create({
	baseURL: 'http://localhost:3000'
})

function validate(res) {
	return (res) && (res.status >= 200) && (res.status < 300)
}

function requestMenu(ifvalid, iferror) {
	client.get('/getData').then(res => ifvalid(res)).catch(err => iferror(err))
}

function updateMenu(data, ifvalid, iferror) {
	client.post('/publish', data).then(res => ifvalid(res)).catch(err => iferror(err))
}

exports.validate = validate
exports.requestMenu = requestMenu
exports.updateMenu = updateMenu
