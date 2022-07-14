const jwt = require('jsonwebtoken')
const config = require('../config.js')
const errorMiddleware = require('./error.js')

exports.verifyToken = (req, res, next) => {
	const token = req.headers['x-access-token']
	if (!token) {
		res.status(401)
		throw new Error("6")
	}
	const p = new Promise(
		(resolved, reject) => {
			jwt.verify(token, config.secret, (err, decoded) => {
				if (err) {
					if (err.name === 'TokenExpiredError') {
						res.status(419)
						throw new Error("5")
					} else {
						res.status(401)
						throw new Error("7")
					}

				}
				resolved(decoded)
			})
		}
	)
	p.then((decoded) => {
		req.decoded = decoded
		res.locals._id = decoded._id
		next()
	}).catch((err) => {
		errorMiddleware.promiseErrHandler(err,req,res)
	})
}

exports.socketVerify = (socket, next) => {
	const token = socket.request.headers['x-access-token']
	if (!token) {
		socket.disconnect(true)
	}
	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			next(new Error(err))
		}
		socket.decoded = decoded;
		next()
	}) 
}