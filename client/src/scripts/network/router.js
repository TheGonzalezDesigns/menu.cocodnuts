/*global exports*/
import axios from 'axios'

let client = axios.create({
	baseUrl: 'menu.cocodnuts.com'
})

exports.validate = (res) => {
	return (res) && (res.status >= 200) && (res.status < 300)
}

exports.requestMenu = (ifvalid, iferror) => {
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
		//console.log('res', res)
	}).catch(err => {
		//console.log('error', err)
		iferror(err)
	})
}

exports.updateMenu = (original, ifvalid, iferror) => {
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
		//console.log('error', err)
		iferror(err)
	})
}

exports.signIn = (ifvalid, iferror) => {
	client.get('/authenticate').then(res => ifvalid(res)).catch(err => {
		//console.log('error', err)
		iferror(err)
	})
}
exports.signOut = (ifvalid, iferror) => {
	client.get('/signOut').then(res => ifvalid(res)).catch(err => {
		//console.log('error', err)
		iferror(err)
	})
}
exports.validateStatus = (ifvalid, iferror) => {
	client.get('/validate').then(res => ifvalid(res)).catch(err => {
		//console.log('error', err)
		iferror(err)
	})
}

exports.submitSchedule = async (original, iferror) => {
	let req = {
		route: 'createSchedule',
		type: 'schedule',
	}
	let data = []
	original.forEach((one) => {
		let schedule = {}
		schedule['data'] = one
		schedule.meta = {}
		data.push(schedule)
	})
	req['data'] = data
	try {
		await client.post('/', req)
	} catch (err) {
		iferror(err)
	}
}
