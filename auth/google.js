const passport = require('passport')
const router = require('express').Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const users = require('../db/collections/users')
module.exports = router

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google client ID / secret not found. Skipping Google OAuth.')
} else {
  const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  }

  console.log('Google? Configged.')

  const strategy = new GoogleStrategy(
    googleConfig,
    (token, refreshToken, profile, done) => {
      const googleId = profile.id
      const name = profile.displayName
      const email = profile.emails[0].value
      const photo = profile.photos
        ? profile.photos[0].value.replace('?sz=50', '')
        : undefined

      users.findOneAndUpdate(
        { googleId },
        { $set: { googleId, name, email, photo } },
        {
          upsert: true, // insert the document if it does not exist
          returnOriginal: false // return the updated document
        },
        (err, results) => {
          if (err) done(err)
          else if (!results || !results.value) done(null, false)
          else done(null, results.value)
        }
      )
    }
  )

  passport.use(strategy)

  router.get('/', passport.authenticate('google', { scope: 'email' }))

  router.get(
    '/callback',
    passport.authenticate('google', {
      successRedirect: CLIENT_URL,
      failureRedirect: CLIENT_URL
    })
  )
}
