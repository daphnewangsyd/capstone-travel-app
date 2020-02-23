import {onSaveTrip, onAddTrip, onCancelTrip, onDeleteTrip, loadTrips} from "./js/app";
import "./styles/main.scss";

// Event listener to add function to existing HTML DOM element
document.getElementById('form-new').addEventListener('submit', onSaveTrip);
document.getElementById('btnTripAdd').addEventListener('click', onAddTrip);
document.getElementById('btnTripCancel').addEventListener('click', onCancelTrip);

// Load all trip data when the web page is loaded.
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    loadTrips().then(()=>{
        document.getElementById('loading').classList.add('invisible');
    });
});

export {onDeleteTrip}