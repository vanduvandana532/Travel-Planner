const travelForm = document.getElementById("travelForm");

const destinationInput =
    document.getElementById("destination");

const dateInput =
    document.getElementById("date");

const activityInput =
    document.getElementById("activity");

const locationInput =
    document.getElementById("location");

const tripList =
    document.getElementById("tripList");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const emptyMessage =
    document.getElementById("emptyMessage");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const formTitle =
    document.getElementById("formTitle");

let trips = JSON.parse(
    localStorage.getItem("travelTrips")
) || [];

let editId = null;

function saveTrips() {

    localStorage.setItem(
        "travelTrips",
        JSON.stringify(trips)
    );
}

function clearForm() {

    travelForm.reset();

    editId = null;

    formTitle.textContent = "Add Destination";

    submitBtn.textContent = "Add Trip";
}

travelForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const destination =
        destinationInput.value.trim();

    const date =
        dateInput.value;

    const activity =
        activityInput.value.trim();

    const location =
        locationInput.value.trim();

    if (
        destination === "" ||
        date === "" ||
        activity === "" ||
        location === ""
    ) {

        alert("Please fill in all fields.");

        return;
    }

    if (editId !== null) {

        const trip = trips.find(
            trip => trip.id === editId
        );

        trip.destination = destination;
        trip.date = date;
        trip.activity = activity;
        trip.location = location;

        alert("Trip updated successfully!");

    }
    else {

        const newTrip = {

            id: Date.now(),

            destination: destination,

            date: date,

            activity: activity,

            location: location

        };

        trips.push(newTrip);

        alert("Trip added successfully!");
    }


    // Save

    saveTrips();

    clearForm();

    displayTrips();
});
function displayTrips() {

    tripList.innerHTML = "";
    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();
    let filteredTrips =
        trips.filter(function(trip) {

            return (

                trip.destination
                    .toLowerCase()
                    .includes(searchText)

                ||

                trip.activity
                    .toLowerCase()
                    .includes(searchText)

                ||

                trip.location
                    .toLowerCase()
                    .includes(searchText)
            );

        });
    if (sortSelect.value === "newest") {

        filteredTrips.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );

    } else {

        filteredTrips.sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );
    }
    if (filteredTrips.length === 0) {

        emptyMessage.style.display = "block";

        if (trips.length > 0) {

            emptyMessage.textContent =
                "No matching trips found.";

        } else {

            emptyMessage.textContent =
                "No trips added yet. Add your first destination!";
        }

        return;

    } else {

        emptyMessage.style.display = "none";
    }
    filteredTrips.forEach(function(trip) {

        const card =
            document.createElement("article");

        card.className = "trip-card";
        card.innerHTML = `

            <h3>🌍 ${trip.destination}</h3>

            <p>
                <strong>📅 Date:</strong>
                ${formatDate(trip.date)}
            </p>

            <p>
                <strong>🎯 Activity:</strong>
                ${trip.activity}
            </p>

            <p>
                <strong>📍 Location:</strong>
                ${trip.location}
            </p>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editTrip(${trip.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTrip(${trip.id})"
                >
                    Delete
                </button>

            </div>
        `;


        tripList.appendChild(card);

    });
}
function formatDate(date) {

    const dateObject =
        new Date(date);

    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}
function editTrip(id) {

    const trip =
        trips.find(
            trip => trip.id === id
        );

    if (!trip) {
        return;
    }
    destinationInput.value =
        trip.destination;

    dateInput.value =
        trip.date;

    activityInput.value =
        trip.activity;

    locationInput.value =
        trip.location;
    editId = id;

    formTitle.textContent =
        "Edit Destination";

    submitBtn.textContent =
        "Update Trip";
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function deleteTrip(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this trip?"
        );


    if (!confirmDelete) {
        return;
    }
    trips =
        trips.filter(
            trip => trip.id !== id
        );


    saveTrips();

    displayTrips();
}
cancelBtn.addEventListener(
    "click",
    function() {

        clearForm();

    }
);
searchInput.addEventListener(
    "input",
    function() {

        displayTrips();

    }
);
sortSelect.addEventListener(
    "change",
    function() {

        displayTrips();

    }
);
displayTrips();