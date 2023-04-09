const db = require("../utils/db")
let argon2 = require("argon2")
let jwt = require("jsonwebtoken")

let register = async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let fullName = req.body.fullName

  let passwordHash

  try {
    passwordHash = await argon2.hash(password)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    return
  }

  let params = [username, passwordHash, fullName]

  let sql =
    "insert into regUsers (username, password_hash, full_name) values (?, ?, ?)"

  try {
    let results = await db.queryPromise(sql, params)
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    return
  }
}

let login = (req, res) => {
  let username = req.body.username
  let password = req.body.password

  let sql =
    "select id, full_name, password_hash from regUsers where username = ?"
  let params = [username]

  db.query(sql, params, async (err, results) => {
    if (err) {
      console.log("Could not get user", err)
      res.sendStatus(500)
    } else {
      if (results.length > 1) {
        console.log("Returned too many results for username")
        res.sendStatus(500)
      } else if (results.length == 0) {
        console.log("Username does not exist")
        res.status(400).send("Username does not exist")
      } else {
        let pwHash = results[0].password_hash
        let fnName = results[0].full_name
        let userId = results[0].id

        let goodPass = false
        try {
          goodPass = await argon2.verify(pwHash, password)
        } catch (err) {
          console.log("Falied to verify password ", err)
          res.status(400).send("Invalid password")
        }
        if (goodPass) {
          let token = {
            fullName: fnName,
            userId: userId,
          }
          let signedToken = jwt.sign(token, process.env.JWT_SECRET)
          res.sendStatus(200)
        } else {
          res.sendStatus(400)
        }
      }
    }
  })
}

module.exports = { register, login }
