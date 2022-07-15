const User = require('../../../../models/user')
const Barcode = require('../../../../models/barcode')
const Image = require('../../../../models/image')
const CheckModule = require('../../../../module/check.js')
const errorMiddleware = require("../../../../middlewares/error")
const fs = require('fs')
const sharp = require("sharp");
const config = require('../../../../config.js')
const path = require('path')
const moment = require('moment-timezone')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const crypto = require('crypto')

const getDate = () => {
	return moment().tz('Asia/Seoul').format('YYYY-MM-DD')
}
const getTime = () => {
	return moment().tz('Asia/Seoul').format('HH:mm:ss')
}
const getDateAndTime = () => {
	return getDate()+' '+getTime()
}
const getTimeStamp = () => {
	return Date.now().toString()
}
const getCurrentUserID = (res) => {
	return res.locals._id
}

/**
 * @api {get} /api/v1/barcode/:barcode 바코드 확인
 * @apiName GetCheckBarcode
 * @apiGroup 바코드
 * @apiVersion 1.0.0
 * @apiParam {String} barcode 확인할 바코드 값
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result 바코드 유무 여부
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		result: true
 *	}
 */

exports.checkBarcode = (req,res,next) => {
	const getBarcode = () => {
		return Barcode.findOne({barcode: req.params.barcode }).exec()
	}
	const send = (barcode) => {
		if(!barcode) {
			return res.status(200).json({
				result: false
			})
		} else {
			return res.status(200).json({
				result: true
			})
		}
	}

	try {
		getBarcode().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}


/**
 * @api {post} /api/v1/barcode 바코드 업로드
 * @apiName UploadBarcode
 * @apiGroup 바코드
 * @apiVersion 1.0.0
 * @apiBody {String} name 제목
 * @apiBody {Number} price 가격
 * @apiBody {String} photo 올릴 이미지의 ID값 ( 그냥 아무거나 넣어주세요 )
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Object} barcode 업로드한 바코드의 데이터
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		uid: "useruid",
		name: "치킨",
		price: 10000,
		barcode: "1678265678",
		photo: "photoUid"
 *	}
 */

exports.createBarcode = (req,res,next) => {
	const createRandomBarcodeID = () => {
		const randomValue = parseInt(new Date().getTime() + (Math.random() * 1234567)).toString()
		const barcodeValue = randomValue.slice(0,10)
		return barcodeValue
	}

	const createBarcode = () => {
		console.log(1)
		const barcode = new Barcode({
			uid: res.locals._id,
			name: req.body.name,
			price: parseInt(req.body.price),
			barcode: createRandomBarcodeID(),
			photo: req.body.photo
		})
		return barcode.save()
	}
	const send = (bc) => {
		console.log(bc)
		return res.status(200).json({
			/*barcode: {
				uid: res.locals._id,
				name: bc.name,
				price: bc.price,
				barcode: bc.barcode,
				photo: bc.photo
			}*/
			uid: res.locals._id,
			name: bc.name,
			price: bc.price,
			barcode: bc.barcode,
			photo: bc.photo
		})
	}

	try {
		createBarcode().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {post} /api/v1/barcode/image/ 바코드 이미지 업로드
 * @apiName UploadBarcodeImage
 * @apiDescription 헤더 사용 필수 Content-Type :  multipart/form-data
 * @apiGroup 바코드
 * @apiVersion 1.0.0
 * @apiBody {File} image 이미지 파일
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {String} id 업로드한 이미지의 고유값
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		id: "imageUID"
 *	}
 */
// multer 로 이미지 받아서 생성.
exports.uploadBarcodePhoto = (req,res,next) => {
	let imgBuffer;
	const zipImage = () => {
		return sharp(req.file.buffer)
			.withMetadata()
			.png({
				quality: 80,
			})
			.toBuffer()
	}
	const uploadImage = (zippedImg) => {
		imgBuffer = zippedImg
		const image = new Image({
			uid: res.locals._id,
			timestamp: Date.now().toString(),
			imgType: req.params.pname,
			image: imgBuffer
		})
		return image.save()
	}
	const send = (img) => {
		return res.status(200).json({
			id: img._id
		})
	}
	try {
		zipImage().then(uploadImage).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {delete} /api/v1/barcode/:barcode 바코드 삭제
 * @apiName DeleteBarcode
 * @apiGroup 바코드
 * @apiVersion 1.0.0
 * @apiParam {String} barcode 바코드 
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
		result: true
	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.deleteBarcode = (req,res,next) => {
	const delBarcode = () => {
		return Barcode.deleteOne({barcode: req.params.barcode}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			result: true
		})
	}
	try {
		delBarcode().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}
/**
 * @api {get} /api/v1/barcode/list 나의 바코드 목록 가져오기
 * @apiName GetMyBarcodeList
 * @apiGroup 바코드
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Object} barcode 나의 바코드의 데이터 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		barcode: [
			{
				uid: "useruid",
				name: "치킨",
				price: 10000,
				barcode: "1678265678",
				photo: "photoUid"
			},
		]
 *	}
 */
exports.getMyBarcodeList = (req,res,next) => {
	const getList = () => {
		return Barcode.find({uid: getCurrentUserID(res)},{_id:0,__v:0}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			barcode: t
		})
	}
	try {
		getList().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}