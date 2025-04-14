const db = require('../models/courseModel'); // using the shared instance

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
    let id = req.params.id;

    db.getEntryById(id).then(
        (entry) => {

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

        //add the participant to the class
        classToBeBooked.participants.push(req.body.name);

        db.update({ id: entry.id }, entry, {}, (err, numReplaced) => {
            if (err) {
                console.log("Error updating database:", err);
                return res.status(500).send("Internal Server Error.");
            }

            res.redirect('/viewCourses'); // Redirect to the class page after booking
        });

    })
}

exports.enrol_course = function(req, res) {
    let id = req.params.courseId; // Extract courseId from the route
   
    db.getEntryById(id).then(
        (entry) => {
            //error handler in case query returns no results
            if (!entry || !entry.classes) {
                console.log("No entry or classes found for id:", id);
                return res.status(404).send("Class not found.");
            }

            
            res.render('enrolCourse', {
                name: entry.name,
                id: entry.id,
                duration: entry.duration,
                startDate: entry.classes[0].dateTime,
            });
        }).catch((err) => {
        console.log('error handling course classes', err);
    });
}

exports.post_enrol_course = function(req, res) {
    
    let id = req.params.courseId;
    let enrolment = req.body.name; // Get the enrolment data from the form

    db.getEntryById(id).then(entry => {
        //error handler in case query returns no results
        if (!entry || !entry.classes) {
            console.log("No entry or classes found for id:", id);
            return res.status(404).send("Class not found.");
        }

        //register the participant in every class for the course
        entry.classes.forEach((classToBeBooked) => {
            classToBeBooked.participants.push(enrolment);
        });

        db.update({ id: entry.id }, entry, {}, (err, numReplaced) => {
            if (err) {
                console.log("Error updating database:", err);
                return res.status(500).send("Internal Server Error.");
            }

            res.redirect('/viewCourses'); // Redirect to the class page after booking
        });

    })
    .catch((err) => {
        console.log('error handling course classes', err);
    });
}

exports.about = function(req, res) {
    res.render("about", {
        'title': 'About Us',
        'message': 'Dance Life is a fun and inclusive club for people of all ages based in the heart of the community. Our main centre can be found at 47 Frederick St, Glasgow',
        'message2': 'Our state of the art studios are equipped with the best equipment to suit all your needs. Studio A is our largest hall and is perfect for large classes and events. Studio B is our smaller hall, perfect for smaller classes and private lessons. Studio C is our newest addition, a teaching-focused space designed for hands-on learning.',
    })
}



