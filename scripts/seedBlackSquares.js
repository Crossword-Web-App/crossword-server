const mongodb = require('mongodb')
let fs = require('fs')

if (process.env.NODE_ENV !== 'production') require('../secrets')


let file = fs.readFileSync('black_square.json')
var data=JSON.parse(file);

const convertSize = (size) => {
    if (size == '15s') return 15
    if (size == '21s') return 21
    if (size == '25s') return 25
}


const restructureJson = json => {
    let storage_array = []
    Object.keys(json).forEach ((key) => {
        json[key].forEach ((ary) => { storage_array.push( 
        {"size": convertSize(key),
        "crossword": ary}           
        )
        })
     }
    )
    return storage_array
}

let seedData = restructureJson(data)


const putStuffInMongo = data => {
  mongodb.MongoClient.connect(
    process.env.MONGODB_URI,
    function(err, client) {
      if (err) throw err

      let db = client.db(process.env.DB_NAME)

      let crosswords = db.collection('black_square_templates')

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
