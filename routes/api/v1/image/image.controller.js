const Image = require('../../../../models/image')
const CheckModule = require('../../../../module/check')
const errorMiddleware = require("../../../../middlewares/error")

/**
 * @api {get} /api/v1/image/:id 바코드 확인
 * @apiName GetImage
 * @apiGroup 이미지
 * @apiVersion 1.0.0
 * @apiParam {String} id 가져올 이미지의 Id값
 * @apiSuccess {Boolean} result 그냥이미지.
 */
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

/**
 * @api {get} /api/v1/image/name/:pname [상품한정] 상품 이미지 가져오기
 * @apiName GetImageByProductName
 * @apiGroup 이미지
 * @apiVersion 1.0.0
 * @apiParam {String} pname 정확한 상품의 이름
 * @apiSuccess {Boolean} result 그냥이미지.
 */
exports.getImageByProductName = (req,res,next) => {
	const typeToSendImg = () => {
		return Image.findOne({imgType: req.params.pname}).exec()
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