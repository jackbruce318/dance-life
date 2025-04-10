const users = require('../models/userModel'); // using the shared instance
const courses = require('../models/courseModel'); // using the shared instance


exports.home = function(req, res) {
    res.render('staff/staffHome', {
        'title': 'Staff Portal',
        'message': 'Welcome to the Staff Portal. This is where you can manage the Dance Life club, including viewing and managing courses and classes.'
    })
}

exports.loggedInHome = function(req, res) {
    console.log("loggedInHome triggered with user", req.user.username)  
    res.render('home', { 'title': 'Dance Life!',
        'message': 'Welcome to the hub for Dance Life, a fun and inclusive club for people of all ages!',
        'user': req.user.username
    });
}