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

exports.view_courses = function(req, res) {
    //get all courses from the database and cast them to a list
    courses.getAllEntries()
    .then((list) => {
      res.render("viewCourses", { //render the entries template and send the courses data to the frontend
        title: "Our Courses",
        entries: list,
        'user': req.user.username
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
}

exports.createCourse = function(req, res) {
    res.render('staff/createCourse', {
        'title': 'Create Course',
        'message': 'Create a new course for the Dance Life club.',
        'user': req.user.username
    });
}

exports.createCoursePost = function(req, res) {
    const courseData = req.body;

    if (!courseData.name || !courseData.description || !courseData.duration) {
        console.error('Missing course data:', courseData);
        return;
    }

    //Create a new course in the database
    courses.createCourse(courseData, function(err, newCourse){});
    res.redirect('/staff/home');
}

exports.deleteCourse = function(req, res) {
    const courseId = req.params.id;
    console.log("deleteCourse triggered with courseId", courseId)
    courses.getEntryById(courseId).then(
        (entry) => {
            res.render('staff/deleteCourse', {
                'title': 'Delete Course',
                'message': 'Are you sure you want to delete this course?',
                'course': entry,
                'user': req.user.username,
                'id': courseId
            });
        })
    .catch((err) => {
        console.log("promise rejected", err);
    });
}

exports.deleteCoursePost = function(req, res) {
    courses.deleteEntry(req.params.id, function(err) {});
    res.redirect('/staff/home');
}