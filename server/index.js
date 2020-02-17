// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
// Cors for cross origin allowance
const cors = require('cors');

// Start up an instance of app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
const port=8080;
const server = app.listen(port, listener);

// Callback to debug
function listener() {
    console.log('Server started on localhost: ${port}');
}

// Initialize all route with a callback function
app.get('/all', getAll);
// Callback function to complete GET '/all'
function getAll(res, req) {
    req.send(projectData);
}
// Post Route
app.post('/add', function (req, res) {
    let data = req.body;
    projectData['temperature'] = data.temperature;
    projectData['date'] = data.date;
    projectData['userResponse'] = data.userResponse;
    res.send(data);
});