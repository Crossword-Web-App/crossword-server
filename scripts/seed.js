const mongodb = require('mongodb')
let { MONGODB_URI, DB_NAME } = require('../secrets')
let fs = require('fs')

let seedData = []
let json = {}
let files = fs.readdirSync('../puzzles/')
for (let i = 1; i < files.length; i++) {
  json = require(`../puzzles/${files[i]}`)
  seedData.push(json)
}

const putStuffInMongo = data => {
  MONGODB_URI = process.env.MONGODB_URI || MONGODB_URI
  DB_NAME = process.env.DB_NAME || DB_NAME
  mongodb.MongoClient.connect(
    MONGODB_URI,
    function(err, client) {
      if (err) throw err

      let db = client.db(DB_NAME)

      let crosswords = db.collection('crosswords')

      crosswords.insert(data, function(err, result) {
        if (err) throw err

        client.close(function(err) {
          if (err) throw err
        })
      })
    }
  )
}

putStuffInMongo(seedData)
