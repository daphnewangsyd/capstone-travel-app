/* Global Variables */

const GEONAMES_USERNAME='miuwusoftpaw';
// Personal API Key for Dark Sky API
const DARK_SKY_API_KEY='aabde7e995d82645e83cc7744086b6cd';

/* Main Functions */
/* Load all trips */
async function loadTrips() {
    console.log("Loading trip data...");
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
    data.forEach(line => {
        const daysTo = getDateDifference(new Date(), Date.parse(line.dateFrom));
        const lineHtml = '<div class="card">\n' +
            '                <div class="row">\n' +
            '                    <h2>\n' +
            '                        <span class="label">Trip to:</span>\n' +
            '                        <span class="content">'+line.location+'</span>\n' +
            '                    </h2>\n' +
            '                    <button class="button-danger float-right btnDelete" onclick="return Client.onDeleteTrip('+line.id+');"><i class="far fa-trash-alt"></i>Delete Trip</button>\n' +
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
            '                        <img class="photo" src="https://media.cntraveler.com/photos/5d8cf7d5db6acf000833e6cc/4:3/w_420,c_limit/Eiffel-Tower_GettyImages-1060266626.jpg" alt="image" data-id="'+line.id+'">\n' +
            '                    </div>\n' +
            '                    <div class="column">\n' +
            '                        <p>The trip is '+daysTo+' days away.</p>\n' +
            '                        <h5>Typical weather:</h5>\n' +
            '                        <div class="weather" data-id="'+line.id+'">\n' +
            '                        </div>\n' +
            '                        <label for="note">Notes</label>\n' +
            '                        <textarea id="note" class="notes" rows="5" onchange="Client.onNotesChanged(this,'+line.id+');">'+line.notes+'</textarea>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>';
        html += lineHtml;
    });
    document.getElementById("trips-list").innerHTML = html;
    console.log("Loading trip data...Done");
    return await renderWeather(data);
}

/* Function to fetch weather information and render the list with the results */
async function renderWeather(data){
    for (const line of data) {
        console.log("Processing: "+line.location);
        try {
            const response = await fetch('http://api.geonames.org/searchJSON?q='+line.location+'&username='+GEONAMES_USERNAME);
            const data = response.json();
            if (data.totalResultsCount === 0){
                continue;
            }
            await data.then(value => console.log(value.geonames[0]));
        } catch (e) {
            console.log('error', e);
        }
    }
}

async function fetchWeather(parsedLocation){

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
    document.getElementById("card-new").classList.add("invisible");
    document.getElementById("btnTripAdd").removeAttribute("disabled");
    // Reset input fields
    document.getElementById("location").value = "";
    document.getElementById("date-start").value = "";
    document.getElementById("date-finish").value = "";
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

export {onSaveTrip, onDeleteTrip, onAddTrip, onCancelTrip, loadTrips, onNotesChanged}
