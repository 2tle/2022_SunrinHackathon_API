const router = require('express').Router()
const controller = require('./image.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const multer = require('multer')
const errorMiddleware = require('../../../../middlewares/error.js')
const upload = multer({dest: 'images/',limits: { fileSize: 5 * 1024 * 1024 }})

router.get('/:id',logMiddleware.consoleLog, controller.sendImg)

module.exports = router