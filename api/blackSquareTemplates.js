const router = require('express').Router()
const blackSquareTemplates = require('../db/collections/blackSquareTemplates')

module.exports = router

router.get('/', (req, res, next) => {
      const { boardSize, count } = req.query

      blackSquareTemplates.aggregate( [{ $match :{ size: +boardSize}}, { $sample: { size: count ? +count : 100 } } ]).toArray((err, results) => {
        if (err) next(err)
        if (!results) next(new Error('No results found'))
        if (!results.length) next(new Error('No board size indicated'))
        else res.json(results)
      })
  })