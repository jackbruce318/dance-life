const courseDAO = require('../models/courseModel');
const db = new courseDAO();
db.init()

exports.home = function(req, res) {
    res.render("home", {
        'title': 'Dance Life!',
        'message': 'Welcome to the hub for Dance Life, a fun and inclusive club for people of all ages!'
    })
}

exports.view_courses = function(req, res) {
    //get all courses from the database and cast them to a list
    db.getAllEntries()
    .then((list) => {
      res.render("viewCourses", { //render the entries template and send the courses data to the frontend
        title: "Our Courses",
        entries: list,
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
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



