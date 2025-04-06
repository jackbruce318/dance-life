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
            name: 'Zumba',
            description: 'Dance with an exercise twist!',
            duration: 'One Week',
            classes: [
                {
                    DateTime: new Date('2025-04-10T18:00:00'),
                    Description: 'Zumba Basics',
                    Location: 'Studio A',
                    Price: 10.0,
                    Participants: []
                },
                {
                    DateTime: new Date('2025-04-12T19:30:00'),
                    Description: 'Zumba Cardio Blast',
                    Location: 'Studio B',
                    Price: 12.5,
                    Participants: []
                },
                {
                    DateTime: new Date('2025-04-15T17:00:00'),
                    Description: 'Zumba Strength Training',
                    Location: 'Studio C',
                    Price: 14.0,
                    Participants: []
                }
            ] 
        });
        //console log to show that DB is initialising as planned
        console.log('db entry Zumba inserted');

        this.db.insert({
            name: 'Street Dance',
            description: 'Urban beats and modern moves!',
            duration: 'Three Weeks',
            classes: [
                {
                    DateTime: new Date('2025-05-20T18:00:00'),
                    Description: 'Street Basics',
                    Location: 'Studio C',
                    Price: 10.0,
                    Participants: []
                },
                {
                    DateTime: new Date('2025-05-27T19:30:00'),
                    Description: 'Street Rhythm',
                    Location: 'Studio B',
                    Price: 12.5,
                    Participants: []
                },
                {
                    DateTime: new Date('2025-06-04T20:00:00'),
                    Description: 'Street Dance Battles',
                    Location: 'Studio A',
                    Price: 14.0,
                    Participants: []
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

}

module.exports = Course;