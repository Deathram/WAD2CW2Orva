const nedb = require('nedb');

class goalList {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });          // constructor for in memory db
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    init() {
        this.db.insert({
            goalType: 'Fitness',             // inserts dummy values.
            goalDesc: 'run 5k in 30 mins',
            startDate: '2020-02-16',
            deadline: '2020-02-16',
            completed: false,
            username: "ChuckNorris"
        });
    }
    //a function to return all goals from the database
    getAllGoals() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, goals for data
            this.db.find({}, function (err, goals) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {
                    resolve(goals);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', goals);
                }
            })
        })
    }

    getUsersGoals(username) {
        return new Promise((resolve, reject) => {
          this.db.find({ username: username, completed: false }, function (err, goals) {         // gets all goals with the specified username and completion status
            if (err) {
              reject(err);
            } else {
              resolve(goals);
            }
          });
        });
      }

    getCompletedGoals() {
        return new Promise((resolve, reject) => {
            this.db.find({ completed: true }, (err, goals) => {               // gets all goals with completion status.
                if (err) {
                    reject(err);
                } else {
                    resolve(goals);
                }
            });
        });
    }

    addGoal(goalType, goalDesc, startDate, deadline, completed, username) {            // function to add the data taken from newGoal post function.
        var goal = {
            goalType: goalType,
            goalDesc: goalDesc,
            startDate: startDate,
            deadline: deadline,
            completed: completed,
            username : username
        }
        console.log('goal created', goal);
        this.db.insert(goal, function (err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            } else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    completeGoal(id) {
        return new Promise((resolve, reject) => {
            console.log(id)     // logs the id it is using for debugging
            this.db.update({ _id: id }, { $set: { completed: true } }, function (err, numReplaced) {      // updates the relevant entry using the ID, sets completed to true. 
            });
        });
    }

    deleteGoal(id) {
        return new Promise((resolve, reject) => {
            console.log(id)     // logs the id it is using for debugging
            this.db.remove({ _id: id },function (err, numRemoved) {      // updates the relevant entry using the ID, sets completed to true. 
            });
        });
    }

}
//make the module visible outside
module.exports = goalList;