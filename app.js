const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const config = require('./config/config')
const ConnectMongo = require('connect-mongo')(session)
const mongoose = require('mongoose').connect(config.dburl)
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const port = 8080
const env = process.env.NODE_ENV || 'development'
const axios = require('axios')
const moment = require('moment')
const server = require('http').Server(app)
const io = require('socket.io')(server)
// send bank transaction with amount date hearth jones
io.on('connection', (socket) => {
  socket.emit('server event', { hello: '<3 from server' })
  socket.on('client event', (data) => {
    console.log(data)
  })
})

// Routers
const topRouter = express.Router()
const tripsRouter = express.Router({mergeParams: true})
const skyScanner_flights_Router = express.Router()
const skyScanner_hotels_Router = express.Router()

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))

// DB
// Mongoose models (should abstract out soon)
const UserModel = require('./database/models/userSchema')(mongoose)
const User = mongoose.model('User', UserModel)

const TripModel = require('./database/models/tripsSchema')(mongoose)
const Trip = mongoose.model('Trips', TripModel)
// DB

// Middleware
const middleware = require('./middleware/index')(express, cookieParser, app, tripsRouter, mongoose, ConnectMongo, passport, port, env, session, config)
// End Middleware

// routes
require('./routes/routes')(express, app, topRouter, passport, config, User, Trip)
require('./routes/trips')(express, app, topRouter, mongoose, TripModel, Trip, User, moment)
require('./routes/users')(app, topRouter, User)
require('./routes/skyScanner')(app, skyScanner_hotels_Router, skyScanner_flights_Router, topRouter, config, Trip, User, moment)
// require('./routes/skyScanner_hotels')(app, skyScanner_hotels_Router, config, Trip, moment)
// routes

// passport auth (FB)
require('./auth/passport/facebookStratgey')(passport, FacebookStrategy, config, mongoose, User, io)

// socket.io
require('./socket_io/socket')(io)

server.listen(app.get('port'), () => {
  console.log(`
    Listening on http://localhost:${port}
    Environment: ${env}
               `)
})
