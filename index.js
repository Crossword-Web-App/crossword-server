const path = require('path')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const ObjectID = require('mongodb').ObjectID
const passport = require('passport')
const MongoDB = require('./db/db')
const PORT = process.env.PORT || 8080
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const app = express()
module.exports = app

if (process.env.NODE_ENV !== 'production') require('./secrets')

const createApp = () => {
  MongoDB.connectDB(err => {
    // get db and collections
    const db = MongoDB.getDB()
    const users = require('./db/collections/users')

    // logging middleware
    app.use(morgan('dev'))

    // body parsing middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    console.log('RUNNING CREATE APP CODE')

    app.use(function(req, res, next) {
      console.log('CLIENT_URL', process.env.CLIENT_URL)
      console.log('process.env.CLIENT_URL', process.env.CLIENT_URL)
      res.header(
        'Access-Control-Allow-Origin',
        process.env.CLIENT_URL || 'http://localhost:3000'
      )
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
      if ('OPTIONS' == req.method) {
        res.send(200)
      } else {
        next()
      }
    })

    // passport registration
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (_id, done) => {
      const o_id = new ObjectID(_id)
      await users.findOne({ _id: o_id }, (err, user) => {
        if (err) done(err)
        else done(null, user)
      })
    })

    // session middleware with passport
    app.use(
      session({
        secret: process.env.SESSION_SECRET || 'my best friend is Alex',
        store: new MongoStore({ db }),
        resave: false,
        saveUninitialized: false
      })
    )
    app.use(passport.initialize())
    app.use(passport.session())

    // auth and api routes
    app.use('/api', require('./api'))
    app.use('/auth', require('./auth'))

    // any remaining requests with an extension (.js, .css, etc.) send 404
    app.use((req, res, next) => {
      if (path.extname(req.path).length) {
        const err = new Error('Not found')
        err.status = 404
        next(err)
      } else {
        next()
      }
    })

    // error handling endware
    app.use((err, req, res, next) => {
      console.error(err)
      console.error(err.stack)
      res
        .status(err.status || 500)
        .send(err.message || 'Internal server error.')
    })
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(process.env.PORT || PORT, () =>
    console.log(`Serving on port ${process.env.PORT || PORT}`)
  )
}

const bootApp = async () => {
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
