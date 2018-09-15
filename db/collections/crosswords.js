const MongoDB = require('../db')

let db = MongoDB.getDB()
let crosswords = db.collection('crosswords')

module.exports = crosswords
