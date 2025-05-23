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
            console.log('user db running in memory only');  
        }
    }

    //passwords are pre hashed because the create method is not used to insert these
    init() {
        this.db.insert({
            user: 'Saxon',
            password: '$2a$10$wp6QLS9DeuSo.xYDz5Zx1ukCG76n1UkdZtH4u6U1HaJH5/lko3Pd.',
            role: 'admin'
        });
        

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
        this.db.find({ 'user': username }, function (err, entries) {
            if (err) {
                console.log("Database error:", err);
                return cb(err, null);
            }
            if (entries.length === 0) {
                return cb(null, null);
            }
            return cb(null, entries[0]);
        });
    }

    delete(username) {
        this.db.remove({ user: username }, {}, function (err, numRemoved) {
            if (err) {
                console.log("Error deleting user:", err);
            } else {
                console.log("Deleted user:", username, "Number of removed entries:", numRemoved);
            }
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