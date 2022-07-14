const errorValue = {
	0: "OtherError", //various error
	1: "Parameter must not be null",
	2: "User is not found",
	3: "Payload too large",
	4: "Did not set profile image yet",
	5: "Token expired",
	6: "Not logged in",
	7: "Invaild token",
	8: "API not found",
	9: "Goal not found",
	10: "Intro not found",
	11: "Score not found",
	12: "Not JSON Data"

}

exports.errorValue = errorValue

exports.notFound = (req, res) => {
	const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
	console.log(req.method, ip,req.originalUrl)
	res.status(404)
	return res.json({
		code: 8,
		message: errorValue[8]
	})
}

exports.promiseErrHandler = (err,req,res) => {
	const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
	console.log(req.method, ip,req.originalUrl)
	if (!res.statusCode) {
		console.error(err.message)
		return res.status(500).json({
			code: 0,
			message: err.message
		})
	}
	else {
		console.error(errorValue[err.message])
		return res.json({
			code: parseInt(err.message),
			message: errorValue[err.message]
		})
	}
}


exports.errorHandler = (err, req, res, next) => {
	const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
	console.log(req.method, ip,req.originalUrl)
	if (!res.statusCode) {
		console.error(err.message)
		return res.status(500).json({
			code: 0,
			message: err.message
		})
	}
	else {
		console.error(errorValue[err.message])
		return res.json({
			code: parseInt(err.message),
			message: errorValue[err.message]
		})
	}
}
