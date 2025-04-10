const bcrypt = require('bcrypt');
const saltRounds = 10;
const Datastore = require('gray-nedb');

class User {
    //constructor - creates new database table for User
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log('UserModel connected to ' + dbFilePath);
        } else {
            this.db = new Datastore();
            console.log('UserModel running in in-memory mode');
        }
    }

    //passwords are pre hashed because the create method is not used to insert these
    init() {
        this.db.insert({
            user: 'Saxon',
            password: '$2a$10$wp6QLS9DeuSo.xYDz5Zx1ukCG76n1UkdZtH4u6U1HaJH5/lko3Pd.',
            role: 'admin'
        });
        console.log("user Saxon added");

        this.db.insert({
            user: 'Jensen',
            password: 'sarif2077',
            role: 'admin'
        });
        return this;
    }
    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                user: username,
                password: hash,
            };
            that.db.insert(entry, function (err) {
            if (err) {
            console.log("Can't insert user: ", username);
            }
            });
        });
    }
    lookup(username, cb) {
        console.log("Looking up user:", username);
        this.db.find({ 'user': username }, function (err, entries) {
            if (err) {
                console.log("Database error:", err);
                return cb(err, null);
            }
            if (entries.length === 0) {
                console.log("No user found for username:", username);
                return cb(null, null);
            }
            console.log("User found:", entries[0]);
            return cb(null, entries[0]);
        });
    }

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


const userModelInstance = new User();
userModelInstance.init();
module.exports = userModelInstance;