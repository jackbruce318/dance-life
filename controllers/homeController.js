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
    console.log('finding class details', req.params.id);
    let id = req.params.id;

    db.getEntryById(id).then(
        (entry) => {

        console.log('Entry classes:', entry.classes);
        res.render('viewClasses', {
            entries: entry.classes,
            courseId: id
        });
        }).catch((err) => {
        console.log('error handling course classes', err);
    });
}

exports.book_class = function(req, res) {
    
    const id = req.params.courseId; // Extract courseId from the route
    const classId = req.params.id; // Extract classId from the route

    db.getEntryById(id).then(
        (entry) => {

            //error handler in case query returns no results
            if (!entry || !entry.classes) {
                console.log("No entry or classes found for id:", id);
                return res.status(404).send("Class not found.");
            }

        const classToBeBooked = entry.classes.find((currentClass) => currentClass.id == classId);

        //error handler in case query returns no results
        if (!classToBeBooked) {
            console.log("Class not found for classId:", classId);
            return res.status(404).send("Class not found.");
        }

        console.log("Class find method returned: ", classToBeBooked.description)

        console.log('Entry classes:', entry.classes);
        res.render('registerAttendance', {
            description: classToBeBooked.description,
            location: classToBeBooked.location,
            date: classToBeBooked.date,
            courseId: entry.id,
            classId: classToBeBooked.id,
        });
        }).catch((err) => {
        console.log('error handling course classes', err);
    });
    

}

exports.post_book_class = function(req, res) {
    //Console output to check that data is flowing correctly
    console.log('Booking class:', req.params.id);
    let id = req.params.id;
    let courseId = req.params.courseId;

    db.getEntryById(courseId).then(entry => {
        //error handler in case query returns no results
        if (!entry || !entry.classes) {
            console.log("No entry or classes found for id:", id);
            return res.status(404).send("Class not found.");
        }

        const classToBeBooked = entry.classes.find((currentClass) => currentClass.id == id);

        //error handler in case query returns no results
        if (!classToBeBooked) {
            console.log("Class not found for classId:", id);
            return res.status(404).send("Class not found.");
        }

        console.log("Class find method returned: ", classToBeBooked.description)

        //add the participant to the class
        classToBeBooked.participants.push(req.body.name);

        //console log to show that participant has been added to the class
        console.log('Participant added to class:', req.body.name);

        message = "You have successfully registered your attendance!"
        res.redirect('/viewCourses'); // Redirect to the class page after booking
    })
}

exports.enrol_course = function(req, res) {
    res.send('<h1>Under Construction, come back later!</h1>');
}



