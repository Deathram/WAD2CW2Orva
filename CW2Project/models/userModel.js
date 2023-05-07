const Datastore = require("nedb");    //creating the database
const bcrypt = require('bcrypt');
const saltRounds = 10;


class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded                       //constructor for db, currently in memory since no filepath specified.
            this.db = new Datastore({
                filename: dbFilePath,
                autoload: true
            });
        } else {
            //in memory
            this.db = new Datastore();
        }
    }

    // for the demo the password is the bcrypt of the user name
    init() {
        this.db.insert({
            user: 'ChuckNorris',
            password:
                'badPassword'       // some dummy entries into the db
        });
        return this;
    }

    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            var goal = {                                             // this method adds new users to the system.
                user: username,
                password: hash,
            };
            that.db.insert(goal, function (err) {
                if (err) {
                    console.log("Can't insert user: ", username);
                }
            });
        });
    }


    lookup(user, cb) {
        this.db.find({ 'user': user }, function (err, goals) {      // looks up to see if user exists
            if (err) {
                return cb(null, null);
            } else {
                if (goals.length == 0) {           
                    return cb(null, null);
                }
                return cb(null, goals[0]);         // otherwise returns details.
            }
        });
    }

}


const dao = new UserDAO();          // creating instance of the object
dao.init();                          // initialising to insert login details for dummy users
module.exports = dao;               // exporting so it can be used outside this file