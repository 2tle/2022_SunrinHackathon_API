const router = require('express').Router()
const controller = require('./auth.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })


router.get('/by-username/:username/exists', logMiddleware.consoleLog, controller.usernameExists)
router.get('/by-email/:email/exists', logMiddleware.consoleLog, controller.emailExists)
router.post('/new', logMiddleware.consoleLog, controller.createNewUser)
router.post('/local', logMiddleware.consoleLog, controller.createToken)
router.patch('/password', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.updatePassword)
router.patch('/by-username/:username', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.updateUsername)
router.patch('/profile', logMiddleware.consoleLog, authMiddleware.verifyToken,upload.single('image'),controller.updateProfile)

router.get('/point',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getMyPoint)
router.get('/point/:email',logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getOtherPoint)
router.post('/point', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.addMyPoint)




module.exports = router