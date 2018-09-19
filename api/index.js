const router = require('express').Router()
module.exports = router

router.use('/crossword', require('./crossword'))
router.use('/users', require('./users'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})