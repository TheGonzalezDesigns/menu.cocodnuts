/*global exports*/
import axios from 'axios'

let client = axios.create({
	baseUrl: 'menu.cocodnuts.com'
})

function validate(res) {
	return (res) && (res.status >= 200) && (res.status < 300)
}

function requestMenu(ifvalid, iferror) {
	const req = {
		route: 'find',
		type: 'item',
		data: {
			meta: {
				query: {
					key: 'name'
				}
			}
		},
		metaOnly: true
	}
	client.post('/', req).then(res => {
		ifvalid(res)
		console.log('res', res)
	}).catch(err => {
		console.log('error', err)
		iferror(err)
	})
}

function updateMenu(original, ifvalid, iferror) {
	let req = {
		route: 'update',
		type: 'item',
	}
	let data = []
	original.forEach((one) => {
		let item = {}
		item['data'] = one
		item.meta = {}
		item['_id'] = item.did
		data.push(item)
	})
	req['data'] = data
	client.post('/', req).then(res => ifvalid(res)).catch(err => {
		console.log('error', err)
		iferror(err)
	})
}

exports.validate = validate
exports.requestMenu = requestMenu
exports.updateMenu = updateMenu
