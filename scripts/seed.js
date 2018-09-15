const mongodb = require('mongodb')
let fs = require('fs')

if (process.env.NODE_ENV !== 'production') require('../secrets')

let seedData = []
let json = {}
let files = fs.readdirSync('../puzzles/')
for (let i = 1; i < files.length; i++) {
  json = require(`../puzzles/${files[i]}`)
  seedData.push(json)
}

const putStuffInMongo = data => {
  mongodb.MongoClient.connect(
    process.env.MONGODB_URI,
    function(err, client) {
      if (err) throw err

      let db = client.db(process.env.DB_NAME)

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
