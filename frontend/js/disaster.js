// ============================================================================
// DISASTER MANAGEMENT
// ============================================================================

function getDisasterApiBaseUrl() {
    if (window.location.hostname === "10.70.80.81") {
        return "http://10.70.80.81:5001";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://10.70.80.81:5001";
}

function calculateDisasterRisk() {
    const floodRisk =
        Number(document.getElementById("floodRisk")?.value) || 0;

    const fireRisk =
        Number(document.getElementById("fireRisk")?.value) || 0;

    const accessibility =
        Number(document.getElementById("emergencyAccess")?.value) || 0;

    const riskScore =
        (floodRisk + fireRisk) / 2;

    let riskLevel = "LOW";

    if (riskScore >= 70) {
        riskLevel = "HIGH";
    } else if (riskScore >= 40) {
        riskLevel = "MEDIUM";
    }

    displayRisk(riskLevel);

    // Call backend API
    fetchDisasterRiskBackend({
        floodRisk,
        fireRisk,
        emergencyAccess: accessibility
    });

    return {
        score: riskScore,
        level: riskLevel,
        emergencyAccessibility: accessibility
    };
}


function displayRisk(level) {
    const element =
        document.getElementById("riskLevel");

    if (!element) {
        return;
    }

    element.textContent = level;

    element.className = "status";

    if (level === "HIGH") {
        element.classList.add("status-danger");
    } else if (level === "MEDIUM") {
        element.classList.add("status-warning");
    } else {
        element.classList.add("status-good");
    }

    // Default local recommendations fallback
    const localRecs = getDisasterRecommendations(level);
    displayDisasterMitigations(localRecs);
}


function getDisasterRecommendations(level) {
    if (level === "HIGH") {
        return [
            "Review emergency access routes.",
            "Improve drainage infrastructure.",
            "Identify emergency assembly areas.",
            "Ensure access for emergency vehicles."
        ];
    }

    if (level === "MEDIUM") {
        return [
            "Monitor vulnerable areas.",
            "Review drainage and emergency routes."
        ];
    }

    return [
        "Maintain existing emergency infrastructure."
    ];
}


function displayDisasterMitigations(mitigations) {
    const container = document.getElementById("disasterMitigationList");
    if (!container) return;

    container.innerHTML = "";
    mitigations.forEach(mit => {
        const item = document.createElement("div");
        item.className = "recommendation";
        item.innerHTML = `🛡️ ${mit}`;
        container.appendChild(item);
    });
}


function displayDisasterHazards(hazards) {
    const container = document.getElementById("disasterHazardList");
    if (!container) return;

    container.innerHTML = "";
    hazards.forEach(hazard => {
        const item = document.createElement("div");
        item.style.padding = "8px 12px";
        item.style.marginBottom = "6px";
        item.style.borderRadius = "8px";
        item.style.background = "var(--peach-light)";
        item.style.color = "#925e49";
        item.style.fontSize = "0.9rem";
        item.innerHTML = `⚠️ ${hazard}`;
        container.appendChild(item);
    });
}


async function fetchDisasterRiskBackend(payload) {
    const statusEl = document.getElementById("disasterStatus");
    const scoreValEl = document.getElementById("disasterScoreValue");
    const noticeEl = document.getElementById("disasterSimulationNotice");

    if (statusEl) {
        statusEl.innerHTML = '<span class="status-indicator loading">🚨 Evaluating hazard models with backend...</span>';
    }

    try {
        const baseUrl = getDisasterApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/disaster`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            displayRisk(data.riskLevel || data.level);

            if (scoreValEl) {
                scoreValEl.textContent = `${data.riskScore} / 100`;
            }

            if (data.identifiedHazards) {
                displayDisasterHazards(data.identifiedHazards);
            }

            if (data.mitigationMeasures) {
                displayDisasterMitigations(data.mitigationMeasures);
            }

            if (noticeEl && data.simulationNotice) {
                noticeEl.textContent = `* ${data.simulationNotice}`;
            }

            if (statusEl) {
                statusEl.innerHTML = '<span class="status-badge status-good">✅ Backend Risk Simulation Synced</span>';
            }
        }

    } catch (err) {
        console.error("Disaster API Error:", err);
        if (statusEl) {
            statusEl.innerHTML = '<span class="status-badge status-warning">⚠️ Using local estimate (Backend offline)</span>';
        }
    }
}

// Bind event listeners
document.addEventListener("DOMContentLoaded", () => {
    const disasterInputs = ["floodRisk", "fireRisk", "emergencyAccess"];
    disasterInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                const flood = Number(document.getElementById("floodRisk")?.value) || 0;
                const fire = Number(document.getElementById("fireRisk")?.value) || 0;
                const score = (flood + fire) / 2;
                const lvl = score >= 70 ? "HIGH" : (score >= 40 ? "MEDIUM" : "LOW");
                displayRisk(lvl);
                const scoreValEl = document.getElementById("disasterScoreValue");
                if (scoreValEl) scoreValEl.textContent = `${score.toFixed(1)} / 100`;
            });
            el.addEventListener("change", calculateDisasterRisk);
        }
    });

    const calcBtn = document.getElementById("btnCalculateDisaster");
    if (calcBtn) {
        calcBtn.addEventListener("click", calculateDisasterRisk);
    }
});