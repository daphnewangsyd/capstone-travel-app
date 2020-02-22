import {onSaveTrip} from "./js/app";
import "./styles/main.scss";

// Event listener to add function to existing HTML DOM element
document.getElementById('btnTripSave').addEventListener('click', onSaveTrip);

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();