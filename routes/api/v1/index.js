const router = require('express').Router()

router.use("/auth", require("./auth"))
router.use("/posts",require('./posts'))
router.use("/barcode", require('./barcode'))
// router.use("/profile", )
router.use("/image",require('./image'))
router.use('/shop', require('./shop'))


module.exports = router