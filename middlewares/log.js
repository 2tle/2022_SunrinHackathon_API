exports.consoleLog = (req,res,next) => {
  try {
	const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
    console.log(req.method,ip,req.originalUrl)
    next()
  } catch(err) {
    console.error(err)
    return res.status(500).json({error: err.message})
  } 
}