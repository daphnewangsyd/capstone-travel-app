import {onSaveTrip, onAddTrip, onCancelTrip, onDeleteTrip} from "./js/app";
import "./styles/main.scss";

// Event listener to add function to existing HTML DOM element
document.getElementById('btnTripSave').addEventListener('click', onSaveTrip);
document.getElementById('btnTripAdd').addEventListener('click', onAddTrip);
document.getElementById('btnTripCancel').addEventListener('click', onCancelTrip);


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();