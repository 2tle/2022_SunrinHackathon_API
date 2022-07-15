const router = require('express').Router()
const controller = require('./barcode.controller.js')
const authMiddleware = require('../../../../middlewares/authorization.js')
const logMiddleware = require('../../../../middlewares/log.js')
const errorMiddleware = require('../../../../middlewares/error.js')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.get('/list', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.getMyBarcodeList)
router.get('/:barcode', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.checkBarcode)
router.delete('/:barcode', logMiddleware.consoleLog,authMiddleware.verifyToken, controller.deleteBarcode )
router.post('/', logMiddleware.consoleLog, authMiddleware.verifyToken, controller.createBarcode)
router.post('/image',logMiddleware.consoleLog, authMiddleware.verifyToken,upload.single('image') ,controller.uploadBarcodePhoto)



module.exports = router