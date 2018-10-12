const MongoDB = require('../db')

let db = MongoDB.getDB()
let blackSquareTemplates = db.collection('black_square_templates')

module.exports = blackSquareTemplates
