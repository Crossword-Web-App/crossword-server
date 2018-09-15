const MongoDB = require('../db')

let db = MongoDB.getDB()
let users = db.collection('users')

module.exports = users
