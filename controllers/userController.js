const db = require('../models/userModel'); // using the shared instance

exports.post_new_user = function(req, res) { const user =
    req.body.username; const password = req.body.pass;
    if (!user || !password) { res.send(401,
        'no user or no password'); return;
    }
    db.lookup(user, function(err, u) { if (u) {
        res.send(401, "User exists:", user); return; }
        db.create(user, password); console.log("register user", user, "password", password);
        res.redirect('/signIn');
    });
} 

exports.signIn = function(req, res) {
    res.render('user/signIn');
}

exports.post_signIn = function(req, res) {
    console.log("returned to controller")
    res.redirect('/viewCourses');
    
}

