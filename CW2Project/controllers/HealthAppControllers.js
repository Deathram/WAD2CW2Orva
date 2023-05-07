const goalsDAO = require('../models/goalListModel');
const db = new goalsDAO();
const userDao = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

db.init();

exports.landing_page = function (req, res) {
  res.render('homepage');
}

exports.goals_list = function (req, res) {
  const token = req.cookies.jwt;

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const username = decoded.username;                                        // get the username from the cookie
  console.log("username for get user goals is ", username);
  db.getUsersGoals(username)                                                   // gets calls the method to get the logged in users goals.
    .then((list) => {
      res.render('goals', {
        'title': 'Goal List',
        'goals': list,
      });
      console.log('promise resolved');
    })
    .catch((err) => {
      console.log('promise rejected', err);
    })

}
exports.not_logged_in = function (req, res) {
  res.render('user/notLoggedIn');
}

exports.health_guides = function (req, res) {
  res.render('guides');
}


exports.about_us = function (req, res) {
  res.render('about');
}

exports.get_completed_goals = function (req, res) {
  db.getCompletedGoals()
    .then((list) => {
      res.render('achievements', {
        'title': 'Achievements',
        'goals': list
      });
      console.log('promise resolved');
    })
    .catch((err) => {
      console.log('promise rejected', err);
    })

}


exports.new_goal = function (req, res) {
  res.render('newGoal', {                           // GET request function that renders the new goal mustache file.
    'title': 'Goal List',
    // 'user': "user"
  })
}

exports.post_new_goal = function (req, res) {                     // this is the POST function, it contians data we add to the database.
  console.log('processing post-new_goal controller');
  if (!req.body.goalDesc) {                                      // the body of the request is parsed so that it can be accessed.
    res.status(400).send("A goal must have a description.");       //mandatory field
    return;
  }
  const token = req.cookies.jwt;

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const username = decoded.username;

  db.addGoal(req.body.goalType, req.body.goalDesc, req.body.startDate, req.body.deadline, false, username);       // adds goal to db
  res.redirect("/goals");
}

exports.complete_goal = function (req, res) {
  const goalId = req.body.goalId;             // Get the goal ID from the request body
  db.completeGoal(goalId)                    // Call the completeGoal function with the goal ID
    .then(() => {
      return db.getAllGoals();                   // Get all goals from the database
    })
    .then((goals) => {
      res.render('goals', {               // Render the goals view with the updated goals data
        'title': 'Goals list',
        'goals': goals
      });
    })
    .catch((err) => {
      console.log('promise rejected', err);
    });
  res.redirect("/goals"); // Move this statement inside the completeGoal function
}

exports.delete_goal = function (req, res) {
  const goalId = req.body.goalId;             // Get the goal ID from the request body
  db.deleteGoal(goalId)                    // Call the deleteGoal function with the goal ID
    .then(() => {
      return db.getAllGoals();                   // Get all goals from the database
    })
    .then((goals) => {
      res.render('goals', {               // Render the goals view with the updated goals data
        'title': 'Goals list',
        'goals': goals
      });
    })
    .catch((err) => {
      console.log('promise rejected', err);
    });
  res.redirect("/goals"); // Move this statement inside the completeGoal function
}

exports.post_new_user = function (req, res) {
  const user = req.body.username;                    // gets the credentials from the request.
  const password = req.body.pass;
  if (!user || !password) {
    res.send(401, 'no user or no password');
    return;                                             // if no credentials are supplied, sends 401.
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    userDao.create(user, password);                                            
    console.log("register user", user, "password", password);
    res.redirect('/login');
  });
}
  

exports.peters_goals = function (req, res) {
  res.send('<h1>Processing Peter\'s goals, see terminal</h1>');
  db.getPetersGoals();
}

exports.show_register_page = function (req, res) {        // request handler. GET requests to the register route leads to the register page.
  res.render("user/register");
}

exports.show_login_page = function (req, res) {        // callback function for login page
  res.render("user/login");
};

exports.handle_login = function (req, res) {       //login functionality
  res.render("loggedInHomepage", {
    title: "Login Page",
  });
}

exports.loggedIn_landing = function (req, res) {
  res.render("loggedInHomepage"), {
    'username' : 'Friend',
  }
};



exports.logout = function (req, res) {           // logout functionality
  res
    .clearCookie("jwt")
    .status(200)
    .redirect("/");
}