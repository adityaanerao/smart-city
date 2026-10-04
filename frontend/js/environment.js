// ============================================================================
// SURROUNDING ENVIRONMENT
// ============================================================================

function getEnvApiBaseUrl() {
    if (window.location.hostname === "10.70.80.81") {
        return "http://10.70.80.81:5001";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://10.70.80.81:5001";
}

function analyzeSurroundingEnvironment(data) {
    const result = {
        schools: data.schools || 0,
        hospitals: data.hospitals || 0,
        parks: data.parks || 0,
        roads: data.roads || 0,
        waterBodies: data.waterBodies || 0,
        publicTransport: data.publicTransport || 0
    };

    displayEnvironmentData(result);

    return result;
}


function displayEnvironmentData(data) {
    setValue("schoolCount", data.schools);
    setValue("hospitalCount", data.hospitals);
    setValue("parkCount", data.parks);
    setValue("roadCount", data.roads);
    setValue("waterBodyCount", data.waterBodies);
    setValue("transportCount", data.publicTransport);
}


function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}


async function loadSurroundingEnvironment(lat = 18.5204, lon = 73.8567) {
    const statusEl = document.getElementById("envStatus");
    const obsContainer = document.getElementById("envObservationsList");

    if (statusEl) {
        statusEl.innerHTML = '<span class="status-indicator loading">🔍 Surveying surrounding environment via Overpass API...</span>';
    }

    try {
        const baseUrl = getEnvApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/environment?lat=${lat}&lon=${lon}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            analyzeSurroundingEnvironment(data);

            if (obsContainer && data.observations) {
                obsContainer.innerHTML = "";
                data.observations.forEach(obs => {
                    const li = document.createElement("div");
                    li.className = "recommendation";
                    li.innerHTML = `🌍 ${obs}`;
                    obsContainer.appendChild(li);
                });
            }

            if (statusEl) {
                const sourceBadge = data.dataSource === "live_overpass" ? "Live OpenStreetMap" : "Baseline Model";
                statusEl.innerHTML = `<span class="status-badge status-good">✅ Environment Data Synced (${sourceBadge})</span>`;
            }
        }

    } catch (err) {
        console.error("Environment API Error:", err);
        if (statusEl) {
            statusEl.innerHTML = '<span class="status-badge status-warning">⚠️ Environment survey unavailable (displaying defaults)</span>';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Read coordinates if saved
    let lat = 18.5204;
    let lon = 73.8567;
    const savedData = localStorage.getItem("smartCitySite");
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed.lat) lat = Number(parsed.lat);
            if (parsed.lon) lon = Number(parsed.lon);
        } catch (e) {
            // ignore
        }
    }

    loadSurroundingEnvironment(lat, lon);

    const refreshBtn = document.getElementById("btnRefreshEnvironment");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => loadSurroundingEnvironment(lat, lon));
    }
});