const express = require('express');
const app = express();
require('dotenv').config();  // will use .env files to store environment variables for configuring jwt tokens.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {                                   // for heroku
  console.log(`Server is listening on port ${PORT}`);
});

const cookieParser = require('cookie-parser');  // cookieparser to parse the cookie containing the jwt tokens.
app.use(cookieParser());

app.use(express.urlencoded({extended: false })); // ensuring we can parse the body of each request.
const mustache = require('mustache-express');

// redirect CSS bootstrap
//app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 

app.engine('mustache', mustache());   // creating mustache engine and registering it as remplate engine for this web app
app.set('view engine', 'mustache');

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const router = require('./routes/HealthAppRoutes');
app.use('/', router); 

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})