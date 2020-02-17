/* Global Variables */
const BASE_URL_WEATHER='http://api.openweathermap.org/data/2.5/weather?';
// Personal API Key for OpenWeatherMap API
const API_KEY='500350f8669fa07140fa893d35b4a064';
// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', onGenerate)
/* Function called by event listener */
function onGenerate(e){
    const zip = document.getElementById('zip').value;
    getWeather(BASE_URL_WEATHER, zip, API_KEY)
        .then(postData)
        .then(updateData);
}
/* Function to GET Web API Data*/
const getWeather = async (baseUrl = '', zip = '', key = '')=>{
    const response = await fetch(baseUrl+'zip='+zip+',us&APPID='+key, {
        method: 'GET'
    });
    try {
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    }catch(error) {
        console.log("error", error);
    }
};

/* Function to POST data */
const postData = async (data) => {
    const transformedData = {
        temperature: data.main.temp,
        date: newDate,
        userResponse: document.getElementById('feelings').value
    };
    console.log(transformedData);
    const response = await fetch('/add', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedData)
    });
    try {
        return await response.json();
    } catch (e) {
        console.log("error", e);
    }
};

/* Function to GET Project Data */
const updateData = async () => {
    const response = await fetch('/all');
    try {
        const data = await response.json();
        document.getElementById('date').innerHTML = data.date;
        document.getElementById('temp').innerHTML = data.temperature;
        document.getElementById('content').innerHTML = data.userResponse;
    } catch (e) {
        console.log('error', e);
    }
};
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();