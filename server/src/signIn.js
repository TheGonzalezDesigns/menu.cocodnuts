const passport = require('passport')
const strategy = require('passport-google-oauth20').Strategy
const api = require('./data/googlePlusApi.js')
const {
	cartel
} = require('./cartel')
const credentials = {
	clientID: api.credentials.client_id,
	clientSecret: api.credentials.client_secret,
	callbackURL: api.credentials.redirect_uris[0]
}
passport.serializeUser((user, done) => {
	console.log('Serializing User... ', user)
	done(null, user._id)

})
passport.deserializeUser(async (id, done) => {
	console.log('Deserializing User... ', id)
	const req = {
		route: 'find',
		type: 'user',
		data: {
			meta: {
				query: {
					_id: id
				}
			}
		},
		metaOnly: true
	}
	const existingUsers = await cartel(req)
	const user = existingUsers[0]
	console.log(`Found ${existingUsers.length} users...`)
	console.log('User:', user)
	done(null, user)
})
passport.use(
	new strategy(credentials, async (accessToken, refreshToken, profile, done) => {
		console.log('Executing Strategy...')
		const data = {
			username: profile.displayName,
			googleId: profile.id
		}
		const req_create = {
			route: 'createUser',
			type: 'user',
			data: [
				{
					data: data,
					meta: {},
				}
			]
		}
		const req_find = {
			route: 'find',
			type: 'user',
			data: {
				meta: {
					query: {
						googleId: data.googleId
					}
				}
			},
			metaOnly: true
		}
		const existingUsers = await cartel(req_find)
		if (existingUsers.length) {
			console.log(`Found ${existingUsers.length} users...`)
			const user = existingUsers[0]
			console.log('User:', user)
			done(null, user)
		} else {
			console.log('Creating a user')
			const user = await cartel(req_create)
			console.log('User Created:', user)
			done(null, user)
		}
		console.log('Exiting Strategy...')
	})
)
