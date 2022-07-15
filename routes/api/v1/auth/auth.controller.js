const User = require('../../../../models/user')
const Dictionary = require('../../../../models/dictionary')
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

/* Function */
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
 * @api {get} /api/v1/auth/by-username/:username/exists 이름 사용 여부
 * @apiName CheckUserWhohasUsername
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiParam {String} username 이름
 * @apiSuccess {Boolean} exists 결과 사용중이면 true 아니면 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공 - 사용가능:
 *	HTTP/1.1 200 OK
 *	{
 * 		exists: false
 *	}
 * @apiSuccessExample {json} 성공 - 사용중:
 *	HTTP/1.1 200 OK
 *	{
 *		exists: true
 *	}
 * 
 */
exports.usernameExists = (req, res, next) => {

	const getUser = (username) => {
		return User.find({ username: username }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(200).json({ exists: false })
		else return res.status(200).json({ exists: true })
	}

	try {
		const username = req.params.username
		if (!username) { 
			res.status(400)
			throw new Error("1")
		}
		getUser(username).then(check).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}

/**
 * @api {get} /api/v1/auth/by-email/:email/exists 이메일 사용 여부
 * @apiName CheckUserWhohasEmail
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiParam {String} email 이메일
 * @apiSuccess {Boolean} exists 결과 사용중이면 true 아니면 false
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공 - 사용가능:
 *	HTTP/1.1 200 OK
 *	{
 * 		exists: false
 *	}
 * @apiSuccessExample {json} 성공 - 사용중:
 *	HTTP/1.1 200 OK
 *	{
 *		exists: true
 *	}
 */
exports.emailExists = (req, res, next) => {


	const getUser = (email) => {
		return User.find({ email: email }).exec()
	}

	const check = (user) => {
		if (!user.length) return res.status(200).json({ exists: false })
		else return res.status(200).json({ exists: true })
	}

	try {
		const email = req.params.email
		if (!email) {
			res.status(400)
			throw new Error("1")
		}
		getUser(email).then(check).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}

/**
 * @api {post} /api/v1/auth/new 새 계정 생성
 * @apiName CreateNewUser
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiBody {String} username 생성할 이름
 * @apiBody {String} email 생성할 이메일
 * @apiBody {String} password 생성할 비밀번호
 * @apiSuccess {String} token 사용자의 토큰
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
 * 		token:"eyJwe..."
 *	}
 */
exports.createNewUser = (req, res, next) => {
	let id;
	let email11;
	let username11;
	let imgBuffer;  

	const createUser = (email1, username1, password1) => {
		const newUser = new User({ email: email1, username: username1, password: password1, profile: '', point: 0 })
		return newUser.save()
	}

	const zip = (user) => {
		id = user._id;
		email11 = user.email;
		username11 = user.username;
		return sharp('./images/defaultUserImg.png')
			.withMetadata()	// 이미지의 exif데이터 유지
			.png({
				quality: 80,

			})
			.toBuffer()
	}

	
	const createProfile = (zipimg) => {
		console.log(1)
		const dic = new Dictionary({
			uid: id,
			dict: []
		})
		dic.save()
		const image = new Image({
			uid: id,
			timestamp: getTimeStamp(),
			imgType: 'Post',
			image: zipimg
		})
		return image.save()
	}

	const updateUser = (ig) => {
		return User.updateOne({_id: id},{profile: ig._id}).exec()
	}

	const createToken = (user) => {
		console.log(user)
		const token = jwt.sign({
			_id: id,
			email: email11,
			username: username11
		}, config.secret, {
				expiresIn: '12h',
				subject: "userinfo",
				issuer: config.hostname
			})
		return res.status(200).json({
			token: token
		})
	}

	try {
		const { email, username } = req.body;
		//console.log(email,username)
		if (email == "" || req.body.password == "") {
			res.status(400)
			throw new Error("1")
		}
		const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
		createUser(email, username,password).then(zip).then(createProfile).then(updateUser).then(createToken).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	}catch(e){
		throw new Error(e.message)
	}
	
	
	

}

/**
 * @api {post} /api/v1/auth/local 로그인
 * @apiName Login
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiBody {String} email 이메일
 * @apiBody {String} password 비밀번호
 * @apiSuccess {String} token 사용자의 토큰
 * @apiSuccess {Boolean} username 이름 등록 여부
 * @apiSuccess {Boolean} profile 프로필 이미지 등록 여부
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		token:"eyJwe..."
 *	}
 */

exports.createToken = (req, res, next) => {
	let token;
	let userId;
	const getUser = (email, password) => {
		return User.findOne({ email: email, password: password }).exec()
	}


	const createToken = (user) => {
		if (user != null) {
			token = jwt.sign({
				_id: user._id,
				email: user.email,
				username: user.username
			}, config.secret, {
					expiresIn: '12h',
					subject: "userinfo",
					issuer: config.hostname
				})
			userId = user._id;
			return res.status(200).json({
				token: token,
			})
		} else {
			res.status(404)
			throw new Error("2")	
		}
	}
	try {
		if (req.body.email == "" || req.body.password == "") {
			res.status(400)
			throw new Error("1")
		}
		const email = req.body.email;
		const password = crypto.createHash('sha512').update(req.body.password).digest('base64')
		getUser(email, password).then(createToken).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
	
}

/**
 * @api {patch} /api/v1/auth/by-username/:username 이름 업데이트
 * @apiName UpdateUsername
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiParam {String} username 업데이트할 이름
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
exports.updateUsername = (req, res, next) => {
	const update = (username) => {
		return User.updateOne({ _id: res.locals._id }, { $set: { username: username } }).exec()
	}
	const send = (t) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (req.params.username == "") {
			res.status(400)
			throw new Error("1")
		}
		update(req.params.username).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}
/**
 * @api {patch} /api/v1/auth/password 비밀번호 변경
 * @apiName UpdatePassword
 * @apiGroup 인증
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiBody {String} currentPasswrod 현재 비밀번호
 * @apiBody {String} changePassword 변경할 비밀번호
 * @apiSuccess {Boolean} result 결과 true 또는 false
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 * 	{
 *		result: true
 *	}
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 */
exports.updatePassword = (req, res, next) => {
	const iCheck = (pw) => {
		const cpw = crypto.createHash('sha512').update(pw).digest('base64')
		return User.findOne({_id:res.locals._id, password:cpw}).exec()
	}
	const update = (user) => {
		if(!user) {
			res.status(400)
			throw new Error("2")
		} else {
			const cpassword = crypto.createHash('sha512').update(req.body.changePassword).digest('base64')
			return User.updateOne({ _id: res.locals._id }, { password: cpassword }).exec()
		}
		

	}
	const send = (r) => {
		return res.status(200).json({ result: true })
	}
	try {
		if (req.body.chagnePassword == "") {
			res.status(400)
			throw new Error("1")
		}
		iCheck(req.body.currentPassword).then(update).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
	
}

/**
 * @api {patch} /api/v1/auth/profile 프로필 이미지 업로드
 * @apiName UploadProfileImage
 * @apiDescription 헤더 사용 필수 Content-Type :  multipart/form-data
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiBody {File} image 이미지 파일
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result 결과 true 또는 false
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
// multer 로 이미지 받아서 생성.
exports.updateProfile = (req,res,next) => {
	let imgBuffer;
	const zipImage = () => {
		return sharp(req.file.buffer)
			.withMetadata()
			.png({
				quality: 80,
			})
			.toBuffer()
	}
	const uploadImage = (dbimg) => {
		
		return Image.updateOne({uid: getCurrentUserID(res), imgType: 'Profile'},{image: imgBuffer}).exec()
		
		
	}
	const updateUser = (img) => {
		console.log(img)
		return User.updateOne({ _id: res.locals._id }, { profile: img._id }).exec()
	}
	const send = (img) => {
		return res.status(200).json({
			result: true
		})
	}
	try {
		if(!req.file.buffer) {
			res.status(400)
			throw new Error("1")
		}
		zipImage().then(uploadImage).then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {get} /api/v1/auth/point 나의 포인트 가져오기
 * @apiName GetMyPoint
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Number} point 내 포인트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		point: 100
 *	}
 */
exports.getMyPoint = (req,res,next) => {
	const getUser = () => {
		return User.findOne({_id: getCurrentUserID(res)}).exec()
	}
	const send = (user) => {
		console.log(user)
		return res.status(200).json({
			point: user.point
		})
	}

	try {
		getUser().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}
/**
 * @api {get} /api/v1/auth/point/:email 타인의 포인트 가져오기
 * @apiName GetOtherPoint
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiParam {String} email 타인의 이메일
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Number} point 타인의 포인트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		point: 100
 *	}
 */
exports.getOtherPoint = (req,res,next) => {
	const getUser = () => {
		return User.findOne({email: req.params.email}).exec()
	}
	const send = (user) => {
		return res.status(200).json({
			point: user.point
		})
	}

	try {
		getUser().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}
/**
 * @api {post} /api/v1/auth/point 내 포인트 수정
 * @apiName UpdatePoint
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiBody {Number} point 포인트값 (+-구분, 기존값에서 더하거나 감소)
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result true or false
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
exports.addMyPoint = (req,res,next) => {
	const update = () => {
		return User.updateOne({_id: getCurrentUserID(res)}, { "$inc" : {
			'point': parseFloat(req.body.point)
		}}).exec()
	}
	const send = (user) => {
		console.log(user)
		return res.status(200).json({
			result: true
		})
	}
	try {
		update().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {get} /api/v1/auth/dict 내 도감 ID목록 가져오기
 * @apiName GetMyDictList
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {List} dict ID값 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		dict: [3,2,6]
 *	}
 */
exports.getMyDictList = (req,res,next) => {
	const getDict = () => {
		return Dictionary.findOne({uid: getCurrentUserID(res)},{_id:0, __v: 0}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			dict: t.dict
		})
	}
	try {
		getDict().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}
/**
 * @api {post} /api/v1/auth/dict/:dict 내 도감에 dict 추가
 * @apiName UpdateMyDict
 * @apiGroup 사용자
 * @apiVersion 1.0.0
 * @apiParam {Number} dict 동물 고유 값
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {Boolean} result true or false
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
exports.addMyDict = (req,res,next) => {
	const updateDict = () => {
		return Dictionary.updateOne({uid: getCurrentUserID(res)},{"$addToSet": {"dict": req.params.dict}}).exec()
	}

	const send = (t) => {
		return res.status(200).json({
			result: true
		})
	}

	try {
		updateDict().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}