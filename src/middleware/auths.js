let jwt = require("jsonwebtoken")

let checkJWT = (req, res, next) => {
  let headerValue = req.get("Authorization")
  let signedToken

  if (headerValue) {
    let parts = headerValue.split(" ")
    signedToken = parts[1]
  }

  if (!signedToken) {
    console.log("Missing signed token")
    res.sendStatus(403)
    return
  }

  try {
    let unsigned = jwt.verify(signedToken, process.env.JWT_SECRET)
    req.userInfo = unsigned
  } catch (err) {
    console.log("Failed to verify token ", err)
    res.sendStatus(403)
    return
  }
  next()
}

module.exports = { checkJWT }
