const router = require('express').Router()
module.exports = router

// OAuth providers
router.use('/google', require('./google'))

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.sendStatus(202)
})
