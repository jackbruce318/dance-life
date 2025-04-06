const courseDAO = require('../models/courseModel');
const db = new courseDAO();
db.init()

exports.home = function(req, res) {
    res.send('<h1>Welcome to Dance Life!</h1>');
}

exports.view_courses = function(req, res) {
    res.send('<h1>Under Construction, come back later!</h1>');
    db.getAllEntries();
}

exports.course_details = function(req, res) {
    res.send('<h1>Under Construction, come back later!</h1>');
}

exports.book_class = function(req, res) {
    res.send('<h1>Under Construction, come back later!</h1>');
}

exports.enrol_course = function(req, res) {
    res.send('<h1>Under Construction, come back later!</h1>');
}



