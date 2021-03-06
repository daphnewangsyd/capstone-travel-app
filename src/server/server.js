// Setup initial JS object to act as value pair object for demo purpose
let projectData = [{
    "location": "Paris, France",
    "dateFrom": '2020-03-02',
    "dateTo": '2020-03-20',
    "duration": 18,
    "notes": "This is a test only."
}];

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
app.options('*', cors());

// Setup Server
const port=8081;
const server = app.listen(port, listener);

// Callback to debug
function listener() {
    console.log('Server started on localhost: 8081');
}

// Default Get Request for testing
app.get("/", (req, res) => {
    res.status(200).send("OK");
});

// Get Request: get all stored trips
app.get('/all', (req, res) => {
    res.send(projectData);
});

// Post Request: add a new trip
app.post('/add', (req, res) => {
    const data = req.body;
    let newData = {
        "location": data.location,
        "dateFrom": data.dateFrom,
        "dateTo": data.dateTo,
        "duration": getDateDifference(new Date(data.dateFrom), new Date(data.dateTo)),
        "notes": ""
    };
    projectData.push(newData);
    res.send(data);
});

// Post Request: delete a trip by its ID
app.post('/delete', (req, res) => {
    const id = req.body.id;
    const data = projectData.splice(id, 1);
    res.send(data);
});

// Post Request: add notes
app.post('/notes', (req, res) => {
    const reqData = req.body;
    const data = projectData[reqData.id];
    data.notes = reqData.notes;
    projectData[reqData.id] = data;
    console.log(projectData);
    res.send(data);
});

// Helper functions
function getDateDifference(dateFrom, dateTo) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(dateFrom - dateTo);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
}

module.exports = app;
