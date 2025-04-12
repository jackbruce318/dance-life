const express = require('express');
const router = express.Router(); 
const controller = require('../controllers/staffController.js');

const { login, verify } = require('../auth/auth');

router.get("/home", verify, controller.home);
router.get("/loggedInHome", verify, controller.loggedInHome);

router.get("/createCourse", verify, controller.createCourse);
router.post("/createCourse", verify, controller.createCoursePost);

router.get("/viewCourses", verify, controller.view_courses);

router.get("/deleteCourse/:id", verify, controller.deleteCourse);
router.post("/deleteCourse/:id", verify, controller.deleteCoursePost);

router.get("/editCourse/:id", verify, controller.editCourse);
router.post("/editCourse/:id", verify, controller.editCoursePost);

router.get("/viewClasses/:id", verify, controller.view_classes);

router.get("/createClass/:id", verify, controller.createClass);
router.post("/createClass/:id", verify, controller.createClassPost);

router.get("/deleteClass/:courseId/:id", verify, controller.deleteClass);
router.post("/deleteClass/:courseId/:id", verify, controller.deleteClassPost);

router.get("/editClass/:courseId/:id", verify, controller.editClass);
router.post("/editClass/:courseId/:id", verify, controller.editClassPost);

router.get("/manageUsers", verify, controller.manageUsers);


router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
    console.log('404 error in staffroutes')
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
    console.log('500 error in staffroutes')
})


module.exports = router;