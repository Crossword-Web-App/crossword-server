const router = require('express').Router()
const board = require('./board.js')
const clues = require('./clues.js')

module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ board, clues })
  } catch (err) {
    next(err)
  }
})