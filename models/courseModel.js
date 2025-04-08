const nedb = require('gray-nedb');

class Course
{
    //constructor - creates new database table for Course
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    //Each course has several classes, which themselves contain a list of participants which are added when users register attendance
    init() {
        this.db.insert({
            id: '2',
            name: 'Zumba',
            description: 'Dance with an exercise twist!',
            duration: 'One Week',
            classes: [
                {
                    id: '4',
                    dateTime: new Date('2025-04-10T18:00:00'),
                    description: 'Zumba Basics',
                    location: 'Studio A',
                    price: 10.0,
                    participants: []
                },
                {
                    id: '5',
                    dateTime: new Date('2025-04-12T19:30:00'),
                    description: 'Zumba Cardio Blast',
                    location: 'Studio B',
                    price: 12.5,
                    participants: []
                },
                {
                    id: '6',
                    dateTime: new Date('2025-04-15T17:00:00'),
                    description: 'Zumba Strength Training',
                    location: 'Studio C',
                    price: 14.0,
                    participants: []
                }
            ] 
        });
        //console log to show that DB is initialising as planned
        console.log('db entry Zumba inserted');

        this.db.insert({
            id: '1',
            name: 'Street Dance',
            description: 'Urban beats and modern moves!',
            duration: 'Three Weeks',
            classes: [
                {
                    id: '1',
                    dateTime: new Date('2025-05-20T18:00:00'),
                    description: 'Street Basics',
                    location: 'Studio C',
                    price: 10.0,
                    participants: []
                },
                {
                    id: '2',
                    dateTime: new Date('2025-05-27T19:30:00'),
                    description: 'Street Rhythm',
                    location: 'Studio B',
                    price: 12.5,
                    participants: []
                },
                {
                    id: '3',
                    dateTime: new Date('2025-06-04T20:00:00'),
                    description: 'Street Dance Battles',
                    location: 'Studio A',
                    price: 14.0,
                    participants: []
                }
            ] 
        });
        //console log to show that DB is initialising as planned
        console.log('db entry Dance inserted');
    }

    //a function to return all entries from the database
    getAllEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, entries for data
            this.db.find({}, function(err, entries) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {
                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', entries);
                }
            })
        })
    }

    //return entry corresponding to a specific id
    getEntryById(id) {
        return new Promise((resolve, reject) => {
            this.db.find({ 'id': id }, function (err, entries) {
                if (err) {
                    reject(err);
                } else {
                    //return the first entry in the entries list because ids are unique
                    resolve(entries[0]);
                    console.log('getEntryById returns: ' ,entries[0]);
                }
            })
        })
    }

    //in this method we add a participant to a class by
    //finding the class in the database and pushing the participant to the participants array
    addParticipant(id, classId){
        this.getEntryById(id).then(
            (entry) => {
                
            //Here we use the find method to search the array for the entry whose id matches the id 
            //which was passed to the method as a parameter
            const classToBeBooked = entry.classes.find((currentClass) => currentClass.id == classId);

            console.log("Class find method returned: ", classToBeBooked.description)
        });
    }

}

module.exports = Course;