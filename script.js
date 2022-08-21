'use strict';

let allBirds;
let accessibleBirds;
let statusList = [];

/**
 * This function is used for filtering the birds by name
 */
function filterByName() {
    var enteredName = document.getElementById('search-bar').value;
    enteredName = enteredName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Loop through all the accessible birds (this means that searching won't override the conservation dropdown selection)
    for (let i = 0; i < accessibleBirds.length; i++) {
        if (accessibleBirds[i].english_name.toLowerCase().includes(enteredName)
        || accessibleBirds[i].primary_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(enteredName)
        || accessibleBirds[i].scientific_name.toLowerCase().includes(enteredName)
        || accessibleBirds[i].family.toLowerCase().includes(enteredName)) {
            document.getElementById(accessibleBirds[i].english_name.toLowerCase()).style.display = 'inline-block';
        } else {
            document.getElementById(accessibleBirds[i].english_name.toLowerCase()).style.display = 'none';
        }
    }
}

/**
 * This function is used for filtering the birds by conservation status
 */
function filterByStatus() {
    let conSelected = document.getElementById('status').value;
    accessibleBirds = [];

    // Looping through all the birds
    for (let i = 0; i < allBirds.length; i++) {
        if (allBirds[i].status === conSelected || conSelected === "all") {
            // If the status selected is the same as the current bird or if it's just set to all then display the bird. Also add to a list of accessible birds which is used to avoid overriding it by searching
            document.getElementById(allBirds[i].english_name.toLowerCase()).style.display = 'inline-block';
            accessibleBirds.push(allBirds[i]);
        } else {
            // If the bird isn't in the selected status then just disable it
            document.getElementById(allBirds[i].english_name.toLowerCase()).style.display = 'none';
        }
    }

    // Just doing a cheeky check here to see if the search bar has anything in it when the option is changed, if it has then it should re-filter using that name
    if (document.getElementById('search-bar').value !== 0) {
        filterByName();
    }
}

/**
 * This function is used for displaying the birds, setting up the conservation dropdown, and setting up the legend
 * @param {The json of birds} data 
 */
function setUpData(data) {
    let statusDropdown = document.getElementById("status");
    let statusLegend = document.getElementById("legend")
    let birdDisplay = document.getElementById("bird-display");

    // Looping through all the data
    for (let i = 0; i < data.length; i++) {

        // Doing a cheeky check to see if the conservation status of the current bird has been added to the status list
        if (!statusList.includes(data[i].status)) {
            statusDropdown.innerHTML += `<option value="${data[i].status}">${data[i].status}</option>`;
            statusList.push(data[i].status);
            statusLegend.innerHTML += `<p>${data[i].status} <span class="dot" style="background-color: ${statusToColour(data[i].status)}"></span>`
        }

        // Here we actually create the bird list!
        birdDisplay.innerHTML += `
        <div class="bird" id="${data[i].english_name.toLowerCase()}">
            <img src="${data[i].photo.source}" alt="${data[i].photo.credit}" style="border: 7px solid ${statusToColour(data[i].status)}">
            <p id="photo-credit">Photo Credit: ${data[i].photo.credit}</p>
            <h2>Primary Name: ${data[i].primary_name}</h2>
            <p>English Name: ${data[i].english_name}</p>
            <p>Scientific Name: ${data[i].scientific_name}</p>
            <p>Family: ${data[i].family}</p>
            <p>Order: ${data[i].order}</p>
            <p>Status: ${data[i].status}</p>
            <p>Length: ${data[i].size.length.value} ${data[i].size.length.units}</p>
            <p>Weight: ${data[i].size.weight.value} ${data[i].size.weight.units}</p>
        </div>  `;
    }
}

function statusToColour(status) {
    // I feel this is pretty straight forward. Just turns names into colours
    switch (status) {
        case 'Not Threatened':
            return '#02a028';
        case 'Naturally Uncommon':
            return '#649a31';
        case 'Relict':
            return '#99cb68';
        case 'Recovering':
            return '#fecc33';
        case 'Declining':
            return '#fe9a01';
        case 'Nationally Increasing':
            return '#c26967';
        case 'Nationally Vulnerable':
            return '#9b0000';
        case 'Nationally Endangered':
            return '#660032'
        case 'Nationally Critical':
            return '#320033'
        case 'Extinct', 'Data Deficient':
            return '#000000'
    }
}

function fetchData() {
    // Grabbin the data
    return fetch('./data/nzbird.json')
        .then(response => response.json())
        .then(data => {
            setUpData(data);
            allBirds = data;
            accessibleBirds = data;
        }).catch(error => console.error(error));
}

const birdData = fetchData();