const router = require('express').Router()
const controller = require('./posts.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })


router.post('/image',logMiddleware.consoleLog,authMiddleware.verifyToken,upload.single('image'),controller.uploadPostImage)
router.get('/post',logMiddleware.consoleLog,authMiddleware.verifyToken,upload.single('image'),controller.getPost)
router.post('/post',logMiddleware.consoleLog,authMiddleware.verifyToken,controller.createPost)



module.exports = router