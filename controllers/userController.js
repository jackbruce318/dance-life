const db = require('../models/userModel'); // using the shared instance


exports.signIn = function(req, res) {
    res.render('user/signIn');
}

exports.post_signIn = function(req, res) {
    res.render('home', { 'title': 'Dance Life!',
        'message': 'Welcome to the hub for Dance Life, a fun and inclusive club for people of all ages!',
        'user': req.body.username
    });
}

exports.createUser = function (req, res) {
    res.render("user/createUser", {
      title: "Create User",
      message: "Please enter user details",
    });
}


//make sure fields are populated and user does not already exist
exports.createUserPost = function (req, res) {
    const user = req.body.user;
    const password = req.body.password;
    if (!user || !password) {
      return;
    }
    db.lookup(user, function (err, u) {
      if (u) {
        return;
      }
      db.create(user, password);
      
      res.redirect("/staff/home");
    });
}

//make sure user is not the same as the one logged in
//and that the user exists in the database
exports.deleteUser = function (req, res) {

  if (!req.params.user) {
    res.send(401, "no user or no password");
  }
  if (req.params.user === req.user.username) {
    
    return;
  }

    res.render("user/deleteUser", {
      title: "Delete User",
      message: "Are you sure you want to delete user ",
      user: req.params.user,
    });
}

exports.deleteUserPost = function (req, res) {
    const user = req.params.user;
    if (!user) {
      res.send(401, "no user or no password");
      return;
    }
    db.lookup(user, function (err, u) {
      if (!u) {
        res.send(401, "User does not exist:", user);
        return;
      }
      db.delete(user);
      console.log("deleted user", user);
      res.redirect("/staff/manageUsers");
    });
}





exports.logout = function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
  };

