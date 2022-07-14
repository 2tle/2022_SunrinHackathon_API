const User = require('../../../../models/user')
const Posts = require('../../../../models/posts')
const Image = require('../../../../models/image')
const Comment = require('../../../../models/comment') 
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


/* router.. */
/**
 * @api {post} /api/v1/posts/post 포스트 게시글 업로드
 * @apiName UploadPost
 * @apiGroup 포스트(게시판)
 * @apiVersion 1.0.0
 * @apiBody {String} title 타이틀
 * @apiBody {String} text 텍스트
 * @apiBody {String} photo 올릴 이미지의 ID값 
 * @apiBody {String} location 게시글의 지역
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
exports.createPost = (req,res,next) => {
	const upload = () => {
		const post = Posts({
			uid: getCurrentUserID(),
			title: req.body.title,
			text: req.body.text,
			photo: req.body.photo,
			location: req.body.location,			
			created: getDateAndTime(),
			likes: []
		})
		return post.save()
	}
	const send = (t) => {
		return res.status(200).json({
			result: true
		})
	}
	try {
		upload().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {post} /api/v1/posts/image 포스트 이미지 업로드
 * @apiName UploadPostImage
 * @apiDescription 헤더 사용 필수 Content-Type :  multipart/form-data
 * @apiGroup 포스트(게시판)
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
exports.uploadPostImage = (req,res,next) => {
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
			uid: getCurrentUserID(),
			timestamp: getTimeStamp(),
			imgType: 'Post',
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
 * @api {get} /api/v1/posts/post 게시글 가져오기
 * @apiName GetPost
 * @apiGroup 포스트(게시판)
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {List} posts 포스트 객체 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		result: [
			...
 		]
 *	}
 */
exports.getPost = (req,res,next) => {
	const getPost = () => {
		return Posts.find().sort({"created": -1}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			posts: t
		})
	}
	try {
		getPost().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {get} /api/v1/posts/post/keyword/:keyword 타이틀에 keyword가 포함된 게시글 가져오기
 * @apiName GetPostByKeyword
 * @apiGroup 포스트(게시판)
 * @apiVersion 1.0.0
 * @apiParam {String} keyword 키워드
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {List} posts 포스트 객체 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		result: [
			...
 		]
 *	}
 */
exports.getPostByKeyword = (req,res,next) => {
	const getPost = () => {
		return Posts.find({title: { $regex: '.*' + req.params.keyword + '.*' } }).sort({"created":-1}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			posts: t
		})
	}

	try {
		getPost().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
	
}
/**
 * @api {get} /api/v1/posts/post/location/:location 지역에 로케이션이 포함된 게시글 가져오기
 * @apiName GetPostByLocation
 * @apiGroup 포스트(게시판)
 * @apiVersion 1.0.0
 * @apiParam {String} location 지역
 * @apiHeader {String} x-access-token 사용자 토큰
 * @apiSuccess {List} posts 포스트 객체 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		result: [
			...
 		]
 *	}
 */
exports.getPostsByLocation = (req,res,next) => {
	const getPost = () => {
		return Posts.find({location: { $regex: '.*' + req.params.location + '.*' } }).sort({"created":-1}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			posts: t
		})
	}

	try {
		getPost().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}