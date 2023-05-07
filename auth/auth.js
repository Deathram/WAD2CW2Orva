const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');      // need user model so we can access credential DB
const jwt = require("jsonwebtoken");      // importing jwt


exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    // checking model to see if user exists
    userModel.lookup(username, function (err, user) {
        if (err) {
            console.log("error looking up user", err);
            return res.status(401).send();
        }
        if (!user) {
            console.log("user ", username, " not found");
            return res.status(401).send();
        }
        //compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { username: user.user };
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", accessToken);
                next();
            } else {
                return res.status(403).send();
            }
        });
    });
}


exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    res.cookie("jwt", accessToken);
    if (!accessToken) {
        return res.redirect('/verificationfailed');       // if cookie does not contain the access token, 403 error is thrown.
    }
    let payload;
    try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);   // checking if request contians secret token. verifies if sent by server.
    next();
    } catch (e) {
    //if an error occurred return request unauthorized error
    res.redirect('/verificationfailed');        // if token is expired or not signed by the server, throws 401 error.
    }
    };

