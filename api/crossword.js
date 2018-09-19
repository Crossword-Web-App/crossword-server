const router = require('express').Router()
const crosswords = require('../db/collections/crosswords')

module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    crosswords.find({ id: +req.params.id }).toArray(function(err, result) {
      if (err) throw err

      res.json(result[0])
    })

  } catch (err) {
    next(err)
  }
})

router.post('/:id', async (req, res, next) => {
  try {
    crosswords.insert({ id: +req.params.id }).toArray(function(err, result) {
      if (err) throw err

      res.json(result[0])
    })

  }
  catch (err) {
      next(err)
    }

      
})  

