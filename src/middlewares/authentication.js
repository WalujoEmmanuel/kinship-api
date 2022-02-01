
const passport = require('./passport-config');

function isAuthEndpoint(url = '') {
	if (
		url === '/api/auth/login' ||
		url === '/api/auth/refresh-token' ||
		url === '/api/auth/blacklist-token' || 
		url === '/api/auth/recover-password' || 
		url === '/api/auth/reset-password' || 
		url.includes('/api?query=')
	) {
		return true
	}

	return false
}

function isAuthQuery (req = '') {

	let query = req.body && req.body.query ? req.body.query : ''

	let isAuthQuery = false
	
	if (
		(query !== '' || req.originalUrl.includes('/api?query=')) && 
		(
			query.includes('welcomeMessage') || 
			query.includes('userLogin') || 
			query.includes('refreshToken') || 
			query.includes('blacklistToken') || 
			query.includes('userRecoverPassword') || 
			query.includes('userResetPassword') || 
			req.originalUrl.includes('userNotifications')
		)
	) {

		isAuthQuery = true
	}
	
	return isAuthQuery
}

function authenticate(req, res, next) {	
	if (
		(isAuthEndpoint(req.originalUrl.toString()) && !isAuthQuery(req)) || 
		(!isAuthEndpoint(req.originalUrl.toString()) && isAuthQuery(req)) ||
		(
			!isAuthEndpoint(req.originalUrl.toString()) && !isAuthQuery(req) && 
			req.originalUrl.toString().replace(/\/$/, "") !== '/api'
		)
	) {
		res.status(400).json({
        status: 'error',
        message: 'Invalid endpoint/query',
      });
		// throw ("Invalid endpoint/query");
	} else if (!isAuthEndpoint(req.originalUrl.toString()) && !isAuthQuery(req)) {
		passport.authenticate('jwt', { session: false })(req, res, function () {
			if (!req.user) {
				throw ("Not Authenticated");
			} else {
				next()
			}
		});
	} else {
		next()
	}
}

function isAuthenticated(req, res, next) {
	if (isAuthEndpoint(req.originalUrl.toString()) && isAuthQuery(req)) {
		next()
	} else {
		if (req.isAuthenticated()) {
			if (req.user) {
				next()
			}
		} else {
			throw ("Not Authenticated");
		}
	}
}


module.exports = { authenticate, isAuthenticated }