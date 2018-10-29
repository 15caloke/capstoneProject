const express = require('express'),
    app = express(),
    port = process.env.PORT || 3010,
    mongoose = require('mongoose'),
    Task = require('./api/models/todoListModel'),
    bodyParser = require('body-parser');

const dbURI = 'mongodb+srv://douglas:kumar@uedb-fyy5j.mongodb.net/fabData?retryWrites=true';
//const dbURI = 'mongodb://localhost/ueREST';

const options = {
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10,
    useNewUrlParser: true // CAREFUL
};


//mongoose instance connection url connection
mongoose.Promise = global.Promise;
////mongoose.connect('mongodb://localhost/ueREST');
// Connect to hosted db
mongoose.connect(dbURI, options).then(
    () => {
        console.log("Database connection established!");
    },
      err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);

// Enable CORS on server-side
// Found this in article at https://jonathanmh.com/how-to-enable-cors-in-express-js-node-js/
// This also helped: https://stackoverflow.com/questions/11001817/allow-cors-rest-request-to-a-express-node-js-application-on-heroku
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const routes = require('./api/routes/todoListRoutes'); // importing route
routes(app); //register route

app.listen(port);

console.log('Fabric server started on: ' + port);
