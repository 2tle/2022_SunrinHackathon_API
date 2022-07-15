const User = require('../../../../models/user')
const ShopItem = require('../../../../models/shopitem')
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
 * @api {get} /api/v1/shop 상점아이템 두짝씩 가져오기
 * @apiName GetShopItem
 * @apiGroup 상점
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰 (테스트 할때만 제거)
 * @apiSuccess {List} shopItem 샵아이템 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		shopItem: [
			{
				category1: "인형",
				price1: 1000,
				name1: "고래인형",
				photo1: "https://....jpg"
				description1: "자 이건 환경을 보호하는 인형이요.",
 *				category2: "인형",
				price2: 1000,
				name2: "고래인형",
				photo2: "https://....jpg"
				description2: "자 이건 환경을 보호하는 인형이요."	
 			},
		]
 *	}
 */
exports.getShopItem = (req,res,next) => {
	const getItem = () => {
		return ShopItem.find({},{_id:0,__v:0}).exec()
	}
	const send = (t) => {
		return res.status(200).json({
			shopItem: t
		})
	}
	try {
		getItem().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}

/**
 * @api {get} /api/v1/shop/random 랜덤으로 상점아이템 하나 가져오기
 * @apiName GetShopItemRandom
 * @apiGroup 상점
 * @apiVersion 1.0.0
 * @apiHeader {String} x-access-token 사용자 토큰 (테스트 할때만 제거)
 * @apiSuccess {List} shopItem 샵아이템 리스트
 * @apiErrorExample {json} 토큰 만료:
 *	HTTP/1.1 419
 *	{
 *	 	code: 5
 *		error: "Token Expired"
 * 	}
 * @apiSuccessExample {json} 성공:
 *	HTTP/1.1 200 OK
 *	{
 *		shopItem: [
			{
				category1: "인형",
				price1: 1000,
				name1: "고래인형",
				photo1: "https://....jpg"
				description1: "자 이건 환경을 보호하는 인형이요.",
 *				category2: "인형",
				price2: 1000,
				name2: "고래인형",
				photo2: "https://....jpg"
				description2: "자 이건 환경을 보호하는 인형이요."	
 			},
		]
 *	}
 */
exports.getRandomShopItem = (req,res,next) => {
	const getItem = () => {
		return ShopItem.find({},{_id:0,__v:0}).exec()
	}
	const send = (t) => {

		const randomIdx=Math.floor(Math.random() * (t.length))
		console.log(randomIdx, t.length-1)
		return res.status(200).json({
			shopItem: [
				t[randomIdx]
			]
		})
	}
	try {
		getItem().then(send).catch((err) => {
			errorMiddleware.promiseErrHandler(err,req,res)
		})
	} catch(e) {
		throw new Error(e.message)
	}
}


exports.temp = (req,res,next) => {
	new ShopItem({
		category1: '문구/완구',
		price1: 6000,
		name1: '수달 필통',
		photo1: 'https://cdn.discordapp.com/attachments/997517799234740295/997518711508447232/otterpencilcase.png',
		description1: '달수? 수달! 귀여운 수달 필통입니다.',
		category2: '인형',
		price2: 8000,
		name2: '나모 인형',
		photo2: 'https://cdn.discordapp.com/attachments/997517799234740295/997518710791221329/fishdoll.png',
		description2: '귀여운 나모 인형입니다. 수업시간에 베고 잘 수 있습니다.',
	}).save()
}