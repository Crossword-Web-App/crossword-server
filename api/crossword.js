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

router.get('/', async (req, res, next) => {
  const { count } = req.query
  if (count) {
    let n = await crosswords.countDocuments()
    const getRandom = () => Math.floor(Math.random() * n)
    crosswords.find({ id: getRandom}).limit(+count).toArray((err, results) => {
      if (err) next(err)
      if (!results) next(new Error('No results found'))
      else res.json(results)
    })
  } else {
    next()
  }
})

router.post('/:id', async (req, res, next) => {
  try {
    crosswords.insert({ id: +req.params.id }).toArray(function(err, result) {
      if (err) throw err

      res.json(result[0])
    })
  } catch (err) {
    next(err)
  }
})
