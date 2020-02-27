/* Global Variables */
// URL & Personal API Key for Geonames API
const GEONAMES_URL='http://api.geonames.org/searchJSON?q=';
const GEONAMES_API_KEY='miuwusoftpaw';
// URL & Personal API Key for Dark Sky API
const PROXY_URL='https://cors-anywhere.herokuapp.com/';
const DARK_SKY_URL='https://api.darksky.net/forecast/';
const DARK_SKY_API_KEY='aabde7e995d82645e83cc7744086b6cd';
const Skycons = require('skycons')(window);
// URL & Personal API Key for Pixabay
const PIXABAY_API_KEY='15408135-25f1970b779ad5fbfa9e24ec7';
const PIXABAY_URL='https://pixabay.com/api/?key=';

/* Main Functions */
/* Load all trips */
async function loadTrips() {
    console.log("Loading trip data...");
    resetInput();
    try {
        const response = await fetch('http://localhost:8081/all');
        const data = await response.json();
        console.log(data);
        return await renderTripList(data);
    } catch (e) {
        console.log('error', e);
    }
}

/* Render the Trip List with the data fetched from the backend */
async function renderTripList(data) {
    let html = "";
    data.forEach((line, i) => {
        const daysTo = getDateDifference(new Date(), Date.parse(line.dateFrom));
        const lineHtml = '<div class="card">\n' +
            '                <div class="row">\n' +
            '                    <h2>\n' +
            '                        <span class="label">Trip to:</span>\n' +
            '                        <span class="content">'+line.location+'</span>\n' +
            '                    </h2>\n' +
            '                    <button class="button-danger float-right btnDelete" onclick="return Client.onDeleteTrip('+i+');"><i class="far fa-trash-alt"></i>Delete Trip</button>\n' +
            '                </div>\n' +
            '                <div class="row">\n' +
            '                    <h5>\n' +
            '                        <span class="label">Trip starts:</span>\n' +
            '                        <span class="content">'+new Date(line.dateFrom).toLocaleDateString()+'</span>\n' +
            '                        <span class="label">Trip ends:</span>\n' +
            '                        <span class="content">'+new Date(line.dateTo).toLocaleDateString()+'</span>\n' +
            '                        <span class="label">Duration:</span>\n' +
            '                        <span class="content">'+line.duration+' days</span>\n' +
            '                    </h5>\n' +
            '                </div>\n' +
            '                <div class="row">\n' +
            '                    <div class="column">\n' +
            '                        <a id="image-link-'+i+'"><img class="photo" src="https://www.atms.com.au/wp-content/uploads/2019/10/placeholder-1-1024x683.png?x93630" alt="image" id="image-'+i+'"></a>\n' +
            '                    </div>\n' +
            '                    <div class="column">\n' +
            '                        <p>The trip is '+daysTo+' days away.</p>\n' +
            '                        <h5>Typical weather:</h5><div class="row"><canvas id="weather-icon-'+i+'" width="128" height="128"></canvas></div>' +
            '                        <div class="weather" id="weather-'+i+'">\n' +
            '                        </div>\n' +
            '                        <div class="row"><label for="note">Notes</label>\n' +
            '                        <textarea id="note" class="notes" rows="5" onchange="Client.onNotesChanged(this,'+i+');">'+line.notes+'</textarea></div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>';
        html += lineHtml;
    });
    document.getElementById("trips-list").innerHTML = html;
    console.log("Loading trip data...Done");
    return await processWeather(data);
}

/* Function to fetch weather information and render the list with the results */
async function processWeather(data){
    let skycons = new Skycons({ 'color': '#3C4858' });
    for (let i=0; i<data.length; i++) {
        const line = data[i];
        console.log("Processing: "+line.location);
        try {
            const response = await fetch(GEONAMES_URL+line.location+'&username='+GEONAMES_API_KEY);
            console.log('Fetching>>>'+GEONAMES_URL+line.location+'&username='+GEONAMES_API_KEY);
            const data = response.json();
            if (data.totalResultsCount === 0){
                continue;
            }
            await data.then(value => {
                const data = fetchWeather(value.geonames[0], line.dateFrom);
                getImage(value.geonames[0].name, value.geonames[0].countryName, i);
                return data;
            }).then(value => {
                renderWeather(i, value);
                skycons.add(document.getElementById("weather-icon-"+i), Skycons.RAIN);
            });
        } catch (e) {
            console.log('error', e);
        }
    }
    skycons.play();
}

async function getImage(location, country, index) {
    console.log("Getting Image for "+location +" "+country+" "+index);
    const data = await fetch(PIXABAY_URL+PIXABAY_API_KEY+'&q='+location+'+'+country+'&image_type=photo');
    data.json().then(value => {
        console.log(value);
        if (value.totalHits === 0){

        } else {
            loadImage(value.hits[0].webformatURL, value.hits[0].pageURL, index);
        }
    });
}

function loadImage(photoUrl, link, index) {
    document.getElementById('image-'+index).setAttribute('src', photoUrl);
    document.getElementById('image-link-'+index).setAttribute('href', link);

}

function renderWeather(lineId, weatherData){
    const data = weatherData.daily.data[0];
    let html = '<p>'+data.summary+'</p><div class="row"><span class="label">Min</span><span class="content">'+data.temperatureMin+'</span><span class="label">Max</span><span class="content">'+data.temperatureMax+'</span></div>';
    document.getElementById("weather-"+lineId).innerHTML = html;
}

async function fetchWeather(parsedLocation, date){
    const parsedDate = Date.parse(date)/1000;
    try {
        const response = await fetch(PROXY_URL+DARK_SKY_URL+DARK_SKY_API_KEY+'/'+parsedLocation.lat+','+parsedLocation.lng+','+parsedDate+'?exclude=currently,hourly');
        return response.json();
    } catch (e) {
        console.log('error', e);
    }
}

/* Functions called by event listener */
/* Function to save a trip */
async function onSaveTrip(e){
    e.preventDefault();
    const data = {
        "location": document.getElementById("location").value,
        "dateFrom": document.getElementById("date-start").value,
        "dateTo": document.getElementById("date-finish").value
    };
    try {
        const saveResponse = await fetch('http://localhost:8081/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await loadTrips();
    } catch (e) {
        console.log('error', e);
    }
}

/* Function to delete a trip */
async function onDeleteTrip(id) {
    console.log('Deleting Trip #'+id);
    try {
        const deleteResponse = await fetch('http://localhost:8081/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        });
        return await loadTrips();
    } catch (e) {
        console.log('error', e);
    }
}

/* Function to save notes upon changing */
async function onNotesChanged(element, id) {
    console.log('Change notes for #'+id);
    try {
        const notesResponse = await fetch('http://localhost:8081/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                notes: element.value
            })
        });
        return await loadTrips();
    } catch (e) {
        console.log('error', e);
    }
}

/* Function to add a trip by showing the form inputs */
function onAddTrip(e) {
    document.getElementById("card-new").classList.remove("invisible");
    document.getElementById("btnTripAdd").setAttribute("disabled", "disabled");
}

/* Function to cancel adding a trip by clearing and hiding the form inputs */
function onCancelTrip(e) {
    resetInput();
}

// Helper functions
function getDateDifference(dateFrom, dateTo) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = dateTo - dateFrom;

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
}

function resetInput() {
    document.getElementById("card-new").classList.add("invisible");
    document.getElementById("btnTripAdd").removeAttribute("disabled");
    // Reset input fields
    document.getElementById("location").value = "";
    document.getElementById("date-start").value = "";
    document.getElementById("date-finish").value = "";
}

export {onSaveTrip, onDeleteTrip, onAddTrip, onCancelTrip, loadTrips, onNotesChanged}
