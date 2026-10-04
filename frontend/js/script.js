console.log("SCRIPT.JS IS RUNNING");

async function loadInfrastructure() {
    try {
        const host = window.location.hostname === "10.70.80.81" ? "10.70.80.81" : (window.location.hostname || "127.0.0.1");
        const response = await fetch(window.BACKEND_URL + "/api/infrastructure");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Infrastructure Data:", data);

        const busEl = document.getElementById("busStations");
        const hospEl = document.getElementById("hospitals");
        const parkEl = document.getElementById("parks");
        const schoolEl = document.getElementById("schools");

        if (busEl) busEl.textContent = data.bus_stations;
        if (hospEl) hospEl.textContent = data.hospitals;
        if (parkEl) parkEl.textContent = data.parks;
        if (schoolEl) schoolEl.textContent = data.schools;

    } catch (error) {
        console.error("Infrastructure fetch error:", error);
        const ids = ["busStations", "hospitals", "parks", "schools"];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.textContent === "Loading...") {
                el.textContent = "Unavailable";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", loadInfrastructure);