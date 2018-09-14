const router = require('express').Router()
const mongodb = require('mongodb')
let { MONGODB_URI, DB_NAME } = require('../secrets')

module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    MONGODB_URI = process.env.MONGODB_URI || MONGODB_URI
    DB_NAME = process.env.DB_NAME || DB_NAME
    mongodb.MongoClient.connect(
      MONGODB_URI,
      function(err, client) {
        if (err) throw err

        let db = client.db(DB_NAME)

        let crosswords = db.collection('crosswords')

        crosswords.find({ id: +req.params.id }).toArray(function(err, result) {
          if (err) throw err

          client.close(function(err) {
            if (err) throw err
          })
          res.json(result[0])
        })
      }
    )
  } catch (err) {
    next(err)
  }
})