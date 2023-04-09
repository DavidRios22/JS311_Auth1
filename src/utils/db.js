const mysql = require("mysql")
require("dotenv").config()

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
})

connection.connect()

// basic promise wrapper if you want to just convert a callback to a promise
connection.queryPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

connection.querySync = async (sql, params) => {
  let promise = new Promise((resolve, reject) => {
    console.log("Executing query: ", sql)
    connection.query(sql, params, (err, results) => {
      if (err) {
        console.log("Rejecting")
        return reject(err)
      } else {
        console.log("Resolving")
        return resolve(results)
      }
    })
  })

  let results = await promise
    .then((results) => {
      console.log("Results ", results)
      return results
    })
    .catch((err) => {
      throw err
    })
  return results
}

connection.query("select now()", (err, results) => {
  if (err) {
    console.log("Not connected", err)
  } else {
    console.log("Connected", results)
  }
})

module.exports = connection
