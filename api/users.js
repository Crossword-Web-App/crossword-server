const router = require('express').Router()
const ObjectID = require('mongodb').ObjectID
const users = require('../db/collections/users')
const userCrosswords = require('../db/collections/userCrosswords')

module.exports = router

router.post('/:id/crossword', async (req, res, next) => {
  const o_id = new ObjectID(req.params.id)
  users.findOneAndUpdate(
    { _id: o_id },
    { $addToSet: { savedCrosswords: req.body.crosswordID } },
    {
      returnOriginal: false // return the updated document
    },
    (err, results) => {
      if (err) next(err)
      else if (!results || !results.value) next(new Error('No results found'))
      else res.sendStatus(202)
    }
  )
})

router.put('/:id/crossword', async (req, res, next) => {
  const userID = req.params.id
  const crosswordID = req.body.id
  const crossword = req.body
  userCrosswords.findOneAndUpdate(
    { userID, 'crossword.id': crosswordID },
    { $set: { userID, crossword } },
    {
      upsert: true,
      returnOriginal: false // return the updated document
    },
    (err, results) => {
      if (err) next(err)
      else if (!results || !results.value) next(new Error('No results found'))
      else res.sendStatus(202)
    }
  )
})

router.get('/:id/crossword/:crosswordId', async (req, res, next) => {
  const userID = req.params.id
  const crosswordID = req.params.crosswordId
  userCrosswords.findOne(
    { userID, 'crossword.id': +crosswordID },
    (err, result) => {
      if (err) next(err)
      else if (!result || !result.crossword) next(new Error('No results found'))
      else res.json(result.crossword)
    }
  )
})

router.get('/:id/all_crosswords', async (req, res, next) => {
  const o_id = new ObjectID(req.params.id)
  const userID = req.params.id
  users.findOne(
    { _id: o_id },
    { projection: { saved_crosswords: 1, _id: 0 } },
    async (err, results) => {
      if (err) next(err)
      else if (!results) next(new Error('No results found'))
      else if (results.saved_crosswords && results.saved_crosswords.length) {
        userCrosswords
          .find({ userID, 'crossword.id': { $in: results.saved_crosswords } })
          .project({ crossword: 1 })
          .toArray(function(err, results) {
            if (err) next(err)
            else if (!results)
              next(new Error('No results found'))
            results && results.length
              ? res.json(results.map(result => result.crossword))
              : res.json([])
          })
      }
      else res.json([])
    }
  )
})
