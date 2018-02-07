/*eslint no-unused-vars: ["warn", { "vars": "local" }]*/
/*global styles global*/
import styles from './styles'
import Vue from 'vue'
import router from './network/router'

const vm = new Vue({
	el: '#app',
	data: {
		options: ['view', 'enter', 'search', 'manage'],
		manage: {
			options: [/*'accounts',*/ 'schedule'],
			selection: 'default'
		},
		name: '',
		category: '',
		price: '',
		photo: '',
		description: '',
		did: '',
		modified: false,
		delete: false,
		searchValue: '',
		item: 'default',
		selection: 'default',
		searchCategory: 'default',
		signedIn: false,
		date: '',
		opening: '',
		closing: '',
		scheduleSubmission: false,
		scheduleType: 'new',
		menu: [],
		data: [],
		edit: {
			name: '',
			category: '',
			price: '',
			photo: '',
			description: '',
			did: '',
			delete: false,
			modified: true,
		},
		backup: {
			name: '',
			category: '',
			price: '',
			photo: '',
			description: '',
			did: '',
			delete: false,
			modified: false,
		},
		errors: [],
		errorCodes: [0, 0, 0, 0, 0], //ltr mirrors ttb
		disabledPreview: true,
		disabledErrors: true,
		disabledSearchInput: true,
		disabledSearchButton: true,
		disabledReviewButton: true,
		disabledReplaceButton: true,
		showSubmitButton: true,
		hideReplaceButton: true,
		overflow: true,
		showTitle: false,
		alert: {
			show: false,
			class: '',
			type: '',
			message: '',
			title: ''
		},
		filter: {
			options: [
				{
					id: 'name',
					active: false,
				},
				{
					id: 'price',
					active: false,
				},
				{
					id: 'category',
					active: false,
				},
			],
			ascending: true,
			current: '',
			data: []
		}
	},
	methods: {
		disability() {
			const disability =
				this.name &&
				this.category &&
				this.price &&
				this.photo &&
				this.description ?
					false :
					true
			this.disabledReviewButton = disability
			this.disabledReplaceButton = disability
		},
		getData() {
			return {
				name: this.name,
				category: this.category,
				price: this.price,
				photo: this.photo,
				description: this.description,
				did: this.did,
				delete: this.delete,
				modified: this.modified
			}
		},
		setData(data) {
			this.name = data.name
			this.category = data.category
			this.price = data.price
			this.photo = data.photo
			this.description = data.description
			this.did = data.did
			this.delete = data.delete
			this.modified = data.modified
			//this.setBackup()
		},
		transferData(src, dest) {
			dest.name = src.name
			dest.category = src.category
			dest.price = src.price
			dest.photo = src.photo
			dest.description = src.description
			dest.did = src.did
			dest.delete = src.delete
			dest.modified = src.modified
		},
		setBackup() {
			const data = this.getData()
			this.transferData(data, this.backup)
		},
		getBackup() {
			this.transferData(this.backup, this)
		},
		eraseData() {
			this.name = ''
			this.category = ''
			this.price = ''
			this.photo = ''
			this.description = ''
			this.did = ''
			this.delete = false
			this.modified = false
		},
		previewData(showSubmitButton = true) {
			document.activeElement.blur()
			this.disabledPreview = false
			this.showSubmitButton = showSubmitButton
		},
		hidePreview() {
			this.disabledPreview = true
			this.showSubmitButton = true
		},
		pushData() {
			const data = this.getData()
			this.menu.push(data)
		},
		reviewData(searchForCopies = true) {
			//this.setBackup()
			const check = this.checkData(searchForCopies)
			if (check.valid) {
				this.previewData()
			} else this.showErrors(check.why)
		},
		publishData() {
			this.pushData()
			this.resetData(true)
			this.updateFile()
		},
		checkData(searchForCopies = true) {
			var errors = []
			var instance = 0
			var check = {
				valid: true,
				why: []
			}
			const priceRegExp = new RegExp('^\\d+(.\\d{1,2})?$', 'g')
			const photoRegExp = new RegExp(
				'^' +
				// protocol identifier
				'(?:(?:https?|ftp)://)' +
				// user:pass authentication
				'(?:\\S+(?::\\S*)?@)?' +
				'(?:' +
				// IP address exclusion
				// private & local networks
				'(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
				'(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
				'(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
				// IP address dotted notation octets
				// excludes loopback network 0.0.0.0
				// excludes reserved space >= 224.0.0.0
				// excludes network & broacast addresses
				// (first & last IP address of each class)
				'(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
				'(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
				'(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
				'|' +
				// host name
				'(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
				// domain name
				'(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
				// TLD identifier
				'(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
				// TLD may end with dot
				'\\.?' +
				')' +
				// port number
				'(?::\\d{2,5})?' +
				// resource path
				'(?:[/?#]\\S*)?' +
				'$',
				'i'
			)
			if (searchForCopies) {
				if (this.menu.length)
					this.menu.forEach(item => (item.name == this.name ? instance++ : 0))
				if (instance) {
					errors.push(
						instance +
						' item(s) with the same name already exist(s).'
					)
					this.errorCodes[0]++
				}
			}
			if (this.name.length < 3) {
				errors.push('The length of the name is too short.')
				this.errorCodes[0]++
			}
			if (this.category.length < 3) {
				errors.push('The length of the category is too short.')
				this.errorCodes[1]++
			}
			if ((this.price + '').match(priceRegExp) === null) {
				errors.push('The price is incorrectly written.')
				this.errorCodes[2]++
			}
			if (this.photo.match(photoRegExp) === null) {
				errors.push('The url of the photo is incorrectly written.')
				this.errorCodes[3]++
			}
			if (this.description.length < 3) {
				errors.push('The length of the description is too short.')
				this.errorCodes[4]++
			}
			check.valid = !errors.length ? true : false
			check.why = errors

			return check
		},
		resetData(hardReset = false) {
			if (hardReset) {
				//Does not reset the menu
				this.eraseData()
				this.resetErrors()
			} else if (this.errorCodes.length) {
				if (this.errorCodes[0]) this.name = ''
				if (this.errorCodes[1]) this.category = ''
				if (this.errorCodes[2]) this.price = ''
				if (this.errorCodes[3]) this.photo = ''
				if (this.errorCodes[4]) this.description = ''
				this.resetErrors()
			}
			this.showSubmitButton = true
			this.disabledReviewButton = true
			this.disabledReplaceButton = true
			this.disabledPreview = true
			this.disabledErrors = true
			this.overflow = true
			this.filter.data = this.menu
		},
		toggleBodyOverflow() {
			this.overflow = !this.overflow
			document.body.className =
				(this.overflow ? 'show' : 'hide') + 'Overflow'
		},
		redisable() {
			this.resetData()
			this.toggleBodyOverflow()
		},
		search() {
			const check = this.checksearch()
			if (check.valid) {
				this.data = this.menu.filter(
					item => item[this.searchCategory] == this.searchValue
				)
				if (!this.data.length) {
					this.searchValue = 'None found.'
				}
			} else {
				this.showErrors(check.why)
				this.searchValue = ''
				this.resetList()
			}
		},
		checksearch() {
			var errors = []
			var check = {
				valid: true,
				why: []
			}
			const priceRegExp = new RegExp('^\\d+(.\\d{1,2})?$', 'g')
			this.resetErrors()
			if (
				this.searchCategory == 'name' ||
				this.searchCategory == 'description' ||
				this.searchCategory == 'category'
			) {
				if (this.searchValue.length < 3) {
					errors.push('The length of the search is too short.')
				}
			}
			if (this.searchCategory == 'price') {
				if (this.searchValue.match(priceRegExp) === null) {
					errors.push('The price is incorrectly written.')
				}
			}
			check.valid = !errors.length ? true : false
			check.why = errors

			return check
		},
		resetErrors() {
			this.errors = []
			this.errorCodes = [0, 0, 0, 0, 0]
		},
		showErrors(errors) {
			document.activeElement.blur()
			this.errors = errors
			this.toggleBodyOverflow()
			this.disabledErrors = false
		},
		enableSearch() {
			this.disabledSearchInput = this.searchCategory == 'default'
			this.disabledSearchButton = this.searchValue ? false : true
		},
		capatalize(text) {
			return text.charAt(0).toUpperCase() + text.slice(1)
		},
		infinitize(text) {
			let l = text.length - 1
			if (text.charAt(l) == 'e') {
				text += 'd'
			} else text += 'ed'
			return text
		},
		editData() {
			this.setData(this.getItem())
			this.hideReplaceButton = false
			this.switchSelection('enter')
		},
		replaceData() {
			this.reviewData(false)
		},
		switchSelection(choice) {
			this.selection = choice
		},
		deleteData() {
			this.menu[this.index]['delete'] = true
			//this.menu.splice(this.index, 1)
			this.search()
			this.updateFile('delete', 'from')

		},
		setIndex() {
			this.index = this.item != 'default' ? parseInt(this.item) : -1
		},
		getItem() {
			const index = this.index
			const data = this.menu[index]
			return data
		},
		setItem() {
			this.setData(this.getItem())
		},
		resetSearch() {
			this.searchCategory = 'default'
			this.searchValue = ''
			this.disabledSearchInput = true
			this.disabledSearchButton = true
			this.resetList()
		},
		resetList() {
			this.item = 'default'
			this.data = []
		},
		republishData() {
			this.deleteData()
			this.publishData()
		},
		cancelData() {
			this.hideReplaceButton = true
			this.eraseData()
		},
		updateFile(action = 'publish', prep = 'to') {
			let upper = this.capatalize(action)
			let ifvalid = res => {
				if (router.validate(res)) {
					vm._alert((upper + ' succeeded'), 'successful')
					vm.cancelData()
				}
			}
			let iferror = () => {
				let infi = this.infinitize(action)
				vm._alert((upper + ' failed.'), 'danger')
				setTimeout(() => {
					vm._alert(
						'This item was ' + infi + ' ' + prep + ' your temporary menu, here.' + '\n' +
						'It will be ' + infi + ' ' + prep + ' your actual menu on the next succesful try' + '\n' +
						'However, this action may not be applied to your actual menu when you exit this page', '', 10000)
				}, 4000)
			}
			let data = this.menu
			router.updateMenu(data, ifvalid, iferror)
		},
		_alert(message, type = '', duration = 2500, callback) {
			this.alert.message = message
			switch (type) {
			case 'successful':
				this.alert.class = 'is-success'
				this.alert.title = 'Success'
				break
			case 'danger':
				this.alert.class = 'is-danger'
				this.alert.title = 'Danger'
				break
			case 'warning':
				this.alert.class = 'is-warning'
				this.alert.title = 'Warning'
				break
			default:
				this.alert.class = 'is-info'
				this.alert.title = 'Attention'
			}
			this.alert.show = true
			setTimeout(function () {
				vm.alert.show = false
				callback()
			}, duration)
		},
		populate() {
			vm.showTitle = true
			let ifvalid = res => {
				if (router.validate(res)) {
					let data = res.data
					//vm._alert('Retrieved the menu from the server!', 'successful')
					data.forEach(one => one.did = one['_id'])
					vm.menu = data
				}
			}
			let iferror = () => {
				let disableApp = () => {
					vm.showTitle = false
				}
				this._alert('Could not retrieve the menu from the server. Please reload the page.', 'danger', 2500, disableApp)
			}
			router.requestMenu(ifvalid, iferror)
		},
		initiate() {
			let ifvalid = res => {
				if (router.validate(res)) {
					if (res.data) vm.signedIn = true
					vm.populate()
				}
			}
			let iferror = () => {
				let disableApp = () => {
					vm.showTitle = false
				}
				this._alert('Could not access the server. Please reload the page.', 'danger', 2500, disableApp)
			}
			router.validateStatus(ifvalid, iferror)
			vm.showTitle = true
		},
		filterView(id) {
			let filter = this.filter
			let data = filter.data
			let polarity = {
				a: -1,
				b: 1
			}
			let callback = (a, b) => {
				let x = a[id]
				let y = b[id]
				if (id == 'price') {
					x = parseFloat(x)
					y = parseFloat(y)
				}
				return x > y ? polarity.a : x == y ? 0 : polarity.b
			}
			filter.options.forEach(option => option.active = option.id == id)
			if (filter.current == id) {
				filter.ascending = true
				filter.current = ''
			} else {
				filter.ascending = false
				filter.current = id
				polarity.a = 1
				polarity.b = -1
			}
			this.filter.data = data.sort(callback)
		},
		signIn() {
			let ifvalid = res => {
				if (router.validate(res)) {
					vm.signedIn = true
				}
			}
			let iferror = () => {
				let disableApp = () => {
					vm.showTitle = false
				}
				this._alert('Access denied', 'danger', 2500, disableApp)
			}
			router.signIn(ifvalid, iferror)
		},
		signOut() {
			const disableApp = () => {
				vm.showTitle = false
			}
			const ifvalid = res => {
				if (router.validate(res)) {
					vm._alert('You\'ve been signed out.', 'warn', 2500, disableApp)
					vm.signedIn = false
				}
			}
			const iferror = () => {
				this._alert('You could not be signed out', 'danger', 2500, disableApp)
			}
			router.signOut(ifvalid, iferror)
		},
		parseDigits(string, a = 0, b = 2) {
			return parseFloat(string.slice(a, b))
		},
		parseHours(string) {
			return this.parseDigits(string) * 60
		},
		parseTime(string) {
			return this.parseHours(string) + this.parseDigits(string, 3, 5)
		},
		reviewTime() {
			return this.parseTime(this.opening) < this.parseTime(this.closing)
		},
		reviewDate() {
			return Date.parse(this.date) >= Date.now()
		},
		reviewSchedule() {
			return this.reviewDate() && this.reviewTime()
		},
		submitSchedule() {
			const iferror = () => {
				vm._alert('Could save your schedule. Please reload the page and try again.', 'danger', 2500)
			}
			const schedule = {
				date: this.date,
				opening: this.opening,
				closing: this.closing
			}
			router.submitSchedule([schedule], iferror)
			this.resetScheduleData()
		},
		enableScheduleSubmission() {
			this.scheduleSubmission = this.date.length && this.opening.length && this.closing.length && this.reviewSchedule()
		},
		resetScheduleData() {
			this.closing = this.opening = this.date = ''
		}
	},
	watch: {
		name() {
			this.disability()
			this.name = this.name.toLowerCase()
		},
		category() {
			this.disability()
			this.category = this.category.toLowerCase()
		},
		price() {
			this.disability()
		},
		photo() {
			this.disability()
		},
		description() {
			this.disability()
		},
		searchValue() {
			this.enableSearch()
			this.searchValue = this.searchValue.toLowerCase()
			this.resetList()
		},
		searchCategory() {
			this.enableSearch()
			this.disability()
			if (this.searchValue == 'none found.') this.searchValue = ''
			this.resetList()
		},
		item() {
			if (this.data.length) {
				this.setIndex()
				this.setItem()
			}
		},
		menu() {
			this.menu.forEach(function (item, index) {
				item.index = index
			})
		},
		selection() {
			this.resetData()
			this.resetSearch()
		},
		date() {
			this.enableScheduleSubmission()
		},
		opening() {
			this.enableScheduleSubmission()
		},
		closing() {
			this.enableScheduleSubmission()
		},
		scheduleType() {
			this.date = this.scheduleType === 'new' ? this.date : '2111-11-11'
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initiate()
		})
	}
})
//global.vm = vm
