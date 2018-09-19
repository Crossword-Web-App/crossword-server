const MongoDB = require('../db')

let db = MongoDB.getDB()
let userCrosswords = db.collection('users_crosswords')

module.exports = userCrosswords
