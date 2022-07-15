const router = require('express').Router()
const controller = require('./shop.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')

router.get('/',logMiddleware.consoleLog, controller.getShopItem)
//router.get('/',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getShopItem)
router.get('/random',logMiddleware.consoleLog, controller.getRandomShopItem)
router.get('/dfasd', controller.temp)
//


module.exports = router