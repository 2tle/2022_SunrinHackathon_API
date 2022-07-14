const router = require('express').Router()

router.use("/auth", require("./auth"))
router.use("/posts",require('./posts'))
// router.use("/profile", )
router.use("/image",require('./image'))


module.exports = router