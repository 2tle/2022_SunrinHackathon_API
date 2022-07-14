const Image = require('../../../../models/image')
const CheckModule = require('../../../../module/check')
const errorMiddleware = require("../../../../middlewares/error")
exports.sendImg = (req,res) => {
	const typeToSendImg = () => {
		return Image.findOne({_id: req.params.id}).exec()
	}

	const bufToImg = (data) => {
		return res.header('Content-Type','image/jpeg').status(200).send(data.image)
	}
	try {
		typeToSendImg().then(bufToImg).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch (e) {
		throw Error(e.message)
	}
	
	
} 