document.addEventListener("DOMContentLoaded", () => {

    const data = JSON.parse(localStorage.getItem("smartCitySite"));

    if (!data) return;

    const analysis = {

        Hospital: [
            ["🚑", "Emergency Access", "Good", "Ambulance and emergency vehicle access should be convenient."],
            ["🛣️", "Road Accessibility", "Good", "Good road connectivity is important for patients and staff."],
            ["🚌", "Public Transport", "Moderate", "Public transport improves accessibility for visitors and staff."],
            ["🅿️", "Parking & Drop-off", "Moderate", "Dedicated parking and patient drop-off areas are needed."],
            ["💧", "Water & Drainage", "Good", "Reliable water supply and drainage are essential."],
            ["⚡", "Power & Utilities", "Good", "Reliable electricity and backup power are important."],
            ["🌳", "Green Space", "Needs Improvement", "Open and green areas should be provided."],
            ["🏥", "Healthcare Network", "Moderate", "Nearby healthcare facilities can support the proposed hospital."]
        ],

        School: [
            ["🚶", "Pedestrian Access", "Good", "Safe pedestrian routes should connect nearby areas."],
            ["🚌", "School Transport", "Good", "School buses and public transport should be accessible."],
            ["🛣️", "Road Accessibility", "Good", "Roads should support students, staff and emergency vehicles."],
            ["🅿️", "Drop-off & Parking", "Moderate", "Dedicated student drop-off areas can reduce congestion."],
            ["🌳", "Recreation & Green Space", "Good", "Open spaces support recreation and outdoor activities."],
            ["💧", "Water & Sanitation", "Good", "Reliable water and sanitation facilities are required."],
            ["🚨", "Safety & Emergency Access", "Good", "Emergency routes should remain accessible."],
            ["🏫", "Nearby Education", "Moderate", "Existing schools can influence local educational demand."]
        ],

        Residential: [
            ["🛣️", "Road Connectivity", "Good", "Residents need convenient road connections."],
            ["💧", "Water & Sewage", "Good", "Reliable water and sewage infrastructure is required."],
            ["🗑️", "Waste Management", "Moderate", "Proper waste collection facilities should be available."],
            ["🚌", "Public Transport", "Good", "Public transport improves daily mobility."],
            ["🌳", "Green Spaces", "Needs Improvement", "Parks and open spaces should be considered."],
            ["🏥", "Healthcare Access", "Moderate", "Nearby healthcare improves access to essential services."],
            ["🏫", "Education Access", "Moderate", "Schools should be accessible to residents."],
            ["🚨", "Emergency Access", "Good", "Emergency vehicles should have clear access."]
        ],

        Commercial: [
            ["🛣️", "Road Accessibility", "Good", "Good roads support customers, employees and deliveries."],
            ["🅿️", "Parking", "Moderate", "Adequate parking can reduce surrounding congestion."],
            ["🚌", "Public Transport", "Good", "Public transport improves customer accessibility."],
            ["🚚", "Delivery Access", "Moderate", "Delivery routes should avoid disrupting traffic."],
            ["⚡", "Electrical Infrastructure", "Good", "Reliable electricity is important for operations."],
            ["🚨", "Emergency Safety", "Good", "Fire and emergency access routes should remain clear."],
            ["🌳", "Green & Public Space", "Needs Improvement", "Green areas can improve the commercial environment."],
            ["🏙️", "Urban Connectivity", "Good", "Connectivity with surrounding areas should be considered."]
        ]
    };

    const selected = analysis[data.infrastructure] || analysis.Hospital;

    document.querySelector(".analysis-section h2").textContent =
        `🏙️ ${data.infrastructure} Infrastructure Analysis`;

    document.querySelectorAll(".infrastructure-analysis-card").forEach((card, i) => {

        const item = selected[i];

        if (item) {
            card.querySelector(".analysis-icon").textContent = item[0];
            card.querySelector("h3").textContent = item[1];
            card.querySelector(".analysis-status").textContent = item[2];
            card.querySelector("p").textContent = item[3];
        }

    });

});
async function loadNearbyInfrastructure() {

    const resultBox = document.getElementById("nearbyInfrastructure");

    if (!resultBox) return;

    resultBox.innerHTML = "🔍 Searching nearby infrastructure...";

    try {

        const response = await fetch(
            window.BACKEND_URL + "/api/infrastructure"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Infrastructure Data:", data);

        resultBox.innerHTML = `
            <p>🏫 Schools: <strong>${data.schools}</strong></p>
            <p>🏥 Hospitals: <strong>${data.hospitals}</strong></p>
            <p>🚌 Bus Stations: <strong>${data.bus_stations}</strong></p>
            <p>🌳 Parks: <strong>${data.parks}</strong></p>
        `;

    } catch (error) {

        console.error("Infrastructure API Error:", error);

        resultBox.innerHTML =
            "⚠️ Unable to load nearby infrastructure data.";

    }
}

loadNearbyInfrastructure();