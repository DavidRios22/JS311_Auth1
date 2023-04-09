// Hello

let hello = (req, res) => {
  console.log("This is hello from the message control")
  res.send("Hello there")
}

// PrivateHello

let privateHello = (req, res) => {
  let fullName = req.userInfo.fullName
  let userId = req.userInfo.userId
  console.log("This is private hello from message control")
  res.send(`Hello there, you are logged in as ${fullName}, with a user id ${userId}`)
}

module.exports = { hello, privateHello }
