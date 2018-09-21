const router = require('express').Router()
const ObjectID = require('mongodb').ObjectID
const users = require('../db/collections/users')
const userCrosswords = require('../db/collections/userCrosswords')
const crosswords = require('../db/collections/crosswords')

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
    (err, userCrossword) => {
      if (err) next(err)
      else if (!userCrossword || !userCrossword.crossword) next(new Error('No results found'))
      else { 
      // userCrossword.crossword has everything but clues
        crosswords.findOne({'id': +crosswordID},
        (err, origCrossword) => {
          if (err) next(err)
          else if (!origCrossword || !origCrossword.clues) next(new Error('No results found'))
          else res.json({...userCrossword.crossword, clues: origCrossword.clues})
        })
      }
    }
  )
})

router.get('/:id/all_crosswords', async (req, res, next) => {
  const o_id = new ObjectID(req.params.id)
  const userID = req.params.id
  users.findOne(
    { _id: o_id },
    { projection: { savedCrosswords: 1, _id: 0 } },
    async (err, results) => {
      if (err) next(err)
      else if (!results) next(new Error('No results found'))
      else if (results.savedCrosswords && results.savedCrosswords.length) {
        userCrosswords
          .find({ userID, 'crossword.id': { $in: results.savedCrosswords } })
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
