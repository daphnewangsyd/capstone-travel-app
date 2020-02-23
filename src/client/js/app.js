/* Global Variables */

const BASE_URL_WEATHER='http://api.openweathermap.org/data/2.5/weather?';
// Personal API Key for OpenWeatherMap API
const API_KEY='500350f8669fa07140fa893d35b4a064';

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
        const daysTo = getDateDifference(line.dateFrom, line.dateTo);
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
            '                        <img src="https://media.cntraveler.com/photos/5d8cf7d5db6acf000833e6cc/4:3/w_420,c_limit/Eiffel-Tower_GettyImages-1060266626.jpg" alt="image" data-id="'+line.id+'">\n' +
            '                    </div>\n' +
            '                    <div class="column">\n' +
            '                        <p>The trip is '+daysTo+' days away.</p>\n' +
            '                        <h5>Typical weather:</h5>\n' +
            '                        <div class="weather" data-id="'+line.id+'">\n' +
            '                        </div>\n' +
            '                        <label for="note">Notes</label>\n' +
            '                        <textarea id="note" class="notes" rows="5">'+line.notes+'</textarea>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>';
        html += lineHtml;
    });
    document.getElementById("trips-list").innerHTML = html;
    console.log("Loading trip data...Done");
    return "OK";
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
    const differenceMs = Math.abs(dateFrom - dateTo);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
}
//
// /* Function to GET Web API Data*/
// const getWeather = async (baseUrl = '', zip = '', key = '')=>{
//     const response = await fetch(baseUrl+'zip='+zip+',us&APPID='+key, {
//         method: 'GET'
//     });
//     try {
//         const weatherData = await response.json();
//         console.log(weatherData);
//         return weatherData;
//     }catch(error) {
//         console.log("error", error);
//     }
// };
//
// /* Function to POST data */
// const postData = async (data) => {
//     const transformedData = {
//         temperature: data.main.temp,
//         date: newDate,
//         userResponse: document.getElementById('feelings').value
//     };
//     console.log(transformedData);
//     const response = await fetch('/add', {
//         method: 'POST',
//         credentials: "same-origin",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(transformedData)
//     });
//     try {
//         return await response.json();
//     } catch (e) {
//         console.log("error", e);
//     }
// };
//
// /* Function to GET Project Data */
// const updateData = async () => {
//     const response = await fetch('/all');
//     try {
//         const data = await response.json();
//         document.getElementById('date').innerHTML = data.date;
//         document.getElementById('temp').innerHTML = data.temperature;
//         document.getElementById('content').innerHTML = data.userResponse;
//     } catch (e) {
//         console.log('error', e);
//     }
// };

export {onSaveTrip, onDeleteTrip, onAddTrip, onCancelTrip, loadTrips}
