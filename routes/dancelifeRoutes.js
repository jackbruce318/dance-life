const express = require('express');
const router = express.Router(); 
const controller = require('../controllers/homeController.js');
const { verify, getUserIfExists } = require('../auth/auth');


router.get("/", getUserIfExists , controller.home);
router.get("/home", getUserIfExists , controller.home);
router.get("/about", getUserIfExists , controller.about);

router.get("/viewCourses", getUserIfExists, controller.view_courses)


router.get("/classes/:id", getUserIfExists, controller.course_details)

router.get("/registerAttendance/:courseId/:id", getUserIfExists, controller.book_class)
router.post("/registerAttendance/:courseId/:id", getUserIfExists, controller.post_book_class)

router.get("/enrolCourse/:courseId", getUserIfExists, controller.enrol_course)
router.post("/enrolCourse/:courseId", getUserIfExists, controller.post_enrol_course)

router.get("/courseEnrol", getUserIfExists, controller.enrol_course)

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
    console.log('404 error in danceliferoutes')
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
    console.log('500 error in danceliferoutes')
})

module.exports = router;