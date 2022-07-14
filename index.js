const express = require('express')
const app = express()
const http = require('http');
const config = require('./config.js')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const logMiddleware = require('./middlewares/log')
const errorMiddleware =require('./middlewares/error.js')
const authMiddleware = require('./middlewares/authorization.js')
const url = require('url')
const timeout = require('express-timeout-handler')
const moment = require('moment-timezone')
const compression = require('compression');


const User = require('./models/user')

const opt = {
	timeout: 10000,
	onTimeout:(req, res) => {
		const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
		console.log(req.method,ip ,req.originalUrl,'[TimeOut]')
    	return res.status(503).json({error: 'Timeout'})
  },
  onDelayedResponse: (req, method, args, requestTime) => {
    console.log(`Attempted to call ${method} after timeout`)
  },
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
}
app.set('port',3000)
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose
	.connect(config.mongodb)
	.then(res => {
		console.log('mongodb connected')
	})
	.catch(e => {
		console.error(e)
	})
app.use(timeout.handler(opt))
app.use(compression())
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)
app.use(express.static('public'))
app.use(bodyParser.json({
	limit : "50mb"
}))
app.use(bodyParser.urlencoded({ limit : "50mb",extended: true }))

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
	res.header('Access-Control-Allow-Headers', 'content-type, x-access-token')
	next()
})

app.set('jwt-secret', config.secret)

app.get('/',logMiddleware.consoleLog , (req, res) => {
	return res.status(200).json({
		status: 200
	})
})




app.use('/api', require('./routes/api'))
app.use(errorMiddleware.notFound)
app.use(errorMiddleware.errorHandler)
app.listen(config.port, () => {
	console.log("run");
})
// const server = http.createServer(app)
// app.io.attach(server)
// server.listen(3000)
// server.on('listening',() => {
// 	console.log("server run")
// });