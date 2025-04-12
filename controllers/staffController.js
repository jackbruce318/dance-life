const users = require('../models/userModel'); // using the shared instance
const courses = require('../models/courseModel'); // using the shared instance
const { nanoid } = require('nanoid');


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

exports.editCourse = function(req, res) {
    const courseId = req.params.id;
    console.log("editCourse triggered with courseId", courseId)
    courses.getEntryById(courseId).then(
        (entry) => {
            res.render('staff/editCourse', {
                'title': 'Edit Course',
                'message': 'Edit the course details below:',
                'course': entry,
                'user': req.user.username,
                'id': courseId
            });
        })
    .catch((err) => {
        console.log("promise rejected", err);
    });
}

exports.editCoursePost = function(req, res) {
    console.log("editCoursePost triggered with courseId", req.params.id)

    const courseId = req.params.id;
    const courseData = req.body;

    if (!courseData.name || !courseData.description || !courseData.duration) {
        console.error('Missing course data:', courseData);
        return;
    }
    console.log("courseData is populated")


    courses.getEntryById(courseId)
        .then((entry) => {
            if (!entry) {
                console.log("No entry found for id:", courseId);
                return res.status(404).send("Course not found.");
            }

            // Update the course in the database
            courses.update(
                { id: courseId }, 
                { 
                    $set: {
                        name: courseData.name,
                        description: courseData.description,
                        duration: courseData.duration
                    }
                }, 
                {}, 
                (err, numReplaced) => {
                    if (err) {
                        console.log("Error updating database:", err);
                        return res.status(500).send("Internal Server Error.");
                    }
                    console.log(`Course edited and saved to database`);
                    res.redirect('/staff/viewCourses');
                }
            );
        })
        .catch((err) => {
            console.log("Error updating course:", err);
            return res.status(500).send("Internal Server Error.");
        });
}

exports.view_classes = function(req, res) {
    console.log('finding class details', req.params.id);
    let id = req.params.id;

    courses.getEntryById(id).then(
        (entry) => {

        console.log('Entry classes:', entry.classes);
        res.render('viewClasses', {
            entries: entry.classes,
            courseId: id,
            'user': req.user.username
        });
        }).catch((err) => {
        console.log('error handling course classes', err);
    });
}

exports.createClass = function(req, res) {
    console.log('createClass triggered with courseId', req.params.id)
    const courseId = req.params.id;
    res.render('staff/createClass', {
        'title': 'Create Class',
        'message': 'Create a new class for the selected course.',
        'courseId': courseId,
        'user': req.user.username
    });
}

exports.createClassPost = function(req, res) {
    console.log('createClassPost triggered with courseId', req.params.id)
    const courseId = req.params.id;
    const classData = req.body;

    classData.id = nanoid(); // Generate a unique ID for the class
    classData.participants = []; // Initialize participants as an empty array

    if (!classData.description || !classData.date || !classData.location) {
        console.error('Missing class data:', classData);
        return;
    }

    //Create a new class in the database
    courses.addClass(courseId, classData, function(err, newClass){});
    res.redirect('/staff/viewCourses');
}

exports.deleteClass = function(req, res) {
    const courseId = req.params.courseId;
    const classId = req.params.id;
    console.log("deleteClass triggered with courseId", courseId, "and classId", classId)
    courses.getEntryById(courseId).then(
        (entry) => {
            const classToDelete = entry.classes.find((currentClass) => currentClass.id == classId);
            res.render('staff/deleteClass', {
                'title': 'Delete Class',
                'message': 'Are you sure you want to delete this class?',
                'class': classToDelete,
                'courseId': courseId,
                'user': req.user.username,
                'id': classId
            });
        })
    .catch((err) => {
        console.log("promise rejected", err);
    });
}

exports.deleteClassPost = function(req, res) {
    const courseId = req.params.courseId;
    const classId = req.params.id;
    console.log("deleteClassPost triggered with courseId", courseId, "and classId", classId)
    courses.deleteClass(courseId, classId, function(err) {});
    res.redirect('/staff/viewClasses/' + courseId);
}

exports.editClass = function(req, res) {
    const courseId = req.params.courseId;
    const classId = req.params.id;
    console.log("editClass triggered with courseId", courseId, "and classId", classId)
    courses.getEntryById(courseId).then(
        (entry) => {
            const classToEdit = entry.classes.find((currentClass) => currentClass.id == classId);
            res.render('staff/editClass', {
                'title': 'Edit Class',
                'message': 'Edit the class details below:',
                'class': classToEdit,
                'courseId': courseId,
                'user': req.user.username,
                'id': classId
            });
        })
    .catch((err) => {
        console.log("promise rejected", err);
    });
}

exports.editClassPost = function(req, res) {
    //Console output to check that data is flowing correctly
    console.log('Editing Class:', req.params.id);
    let classId = req.params.id;
    let courseId = req.params.courseId;
    let classData = req.body;

    courses.getEntryById(courseId)
        .then(entry => {
            if (!entry || !entry.classes) {
                console.log("No entry or classes found for courseId:", courseId);
                return res.status(404).send("Course not found.");
            }

            const classToBeEdited = entry.classes.find((currentClass) => currentClass.id == classId);

            if (!classToBeEdited) {
                console.log("Class not found for classId:", classId);
                return res.status(404).send("Class not found.");
            }

            console.log("Found class to edit:", classToBeEdited.description);

            //Update class details
            classToBeEdited.description = classData.description;
            classToBeEdited.date = classData.date;
            classToBeEdited.location = classData.location;

            //Update course with modified class
            courses.update(
                { id: courseId }, 
                entry, 
                {}, 
                (err, numReplaced) => {
                    if (err) {
                        console.log("Error updating database:", err);
                        return res.status(500).send("Internal Server Error.");
                    }
                    console.log(`Class ${classId} updated successfully`);
                    res.redirect(`/staff/viewClasses/${courseId}`);
                }
            );
        })
        .catch(err => {
            console.log("Error updating class:", err);
            return res.status(500).send("Internal Server Error.");
        });
}

exports.manageUsers = function(req, res) {
    users.getAllEntries()
    .then((list) => {
        console.log("attempting to render");

        res.render('staff/manageUsers', {
            title: "Manage Users",
            entries: list,
            user: req.user.username
        });
    })
    .catch((err) => {
        console.log("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    });
}
