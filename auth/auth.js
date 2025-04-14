const bcrypt = require("bcrypt");
const userModel = require("../models/userModel"); // using the shared instance
const jwt = require("jsonwebtoken");

exports.login = function (req, res,next) {

  let username = req.body.username;
  let password = req.body.password;
 
  userModel.lookup(username, function (err, user) {
    if (err) {
      return res.status(401).send();
    }
    if (!user) {
      console.log("user ", username, " not found");
      return res.render("user/register");
    }
    //compare provided password with stored password
    console.log("user found")
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        //use the payload to store information about the user such as username.
        let payload = { username: username };
        //create the access token 
        let accessToken;

        try {
            accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 300 });
            res.cookie("jwt", accessToken);
            next();
        } catch (err) {
            console.log("Error creating JWT:", err);
            return res.status(500).send("Internal Server Error.");
        }
      } else {
        return res.render("user/signIn"); //res.status(403).send();
      }
    });
  });
};

exports.verify = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
      return res.status(403).send("Not Authorized");
  }
  try {
      // Verify the token and attach payload to request
      let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload; // Attach the payload to the request object
      
      next();
  } catch (e) {
      res.status(401).send("Not Authorized");
  }
};