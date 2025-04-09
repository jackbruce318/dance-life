const express = require('express');
const router = express.Router(); 
const controller = require('../controllers/homeController.js');


router.get("/", controller.home);

router.get("/viewCourses", controller.view_courses)


router.get("/classes/:id", controller.course_details)

router.get("/registerAttendance/:courseId/:id", controller.book_class)
router.post("/registerAttendance/:courseId/:id", controller.post_book_class)

router.get("/enrolCourse/:courseId", controller.enrol_course)
router.post("/enrolCourse/:courseId", controller.post_enrol_course)

router.get("/courseEnrol", controller.enrol_course)

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

module.exports = router;