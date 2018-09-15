const MongoClient = require('mongodb').MongoClient
let db

// Initialize connection once
const connectDB = async callback => {
  try {
    MongoClient.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true },
      (err, client) => {
        db = client.db(process.env.DB_NAME)
        return callback(err)
      }
    )
  } catch (e) {
    throw e
  }
}

const getDB = () => db

const disconnectDB = () => db.close()

module.exports = { connectDB, getDB, disconnectDB }
