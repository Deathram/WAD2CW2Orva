const express = require('express');
const router = express.Router();
const {login} = require('../auth/auth'); //impirting auth.js
const controller = require('../controllers/HealthAppControllers.js');
const {verify} = require('../auth/auth');  //importing verify function so that we can lock certain routes behind verification.


router.post('/new', verify, controller.post_new_goal);
router.get('/new', verify, controller.new_goal);  // route locked behind verification.

router.get("/", controller.landing_page);      // takes the user to the hompage.
router.get("/goals", verify, controller.goals_list);       // takes the user to a list of goals.
router.get("/achievements", verify, controller.get_completed_goals);       // takes the user to a list of goals.
router.get("/guides", controller.health_guides)


router.get("/about", controller.about_us);

router.get('/register', controller.show_register_page); //routing for registration.
router.post('/register', controller.post_new_user);  // for handling POST requests
router.get('/login', controller.show_login_page); // to handle GET request for login page
router.post('/login', login, controller.handle_login); //login handler for POST
router.get("/loggedIn",verify, controller.loggedIn_landing);
router.get("/logout",verify, controller.logout); // logout request
router.get("/verificationFailed", controller.not_logged_in);

router.post('/complete-goal', controller.complete_goal);      // route to complete goal
router.post('/delete-goal', controller.delete_goal);            // route to delete goal



// error handling//
router.get('/peter', controller.peters_goals);
router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})
router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})
module.exports = router;