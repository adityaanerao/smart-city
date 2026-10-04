// ============================================================================
// IMPACT ANALYSIS
// ============================================================================

function getImpactApiBaseUrl() {
    if (window.location.hostname === "10.70.80.81") {
        return "http://10.70.80.81:5001";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://10.70.80.81:5001";
}

function calculateImpactAnalysis(inputs) {
    const environmental =
        Number(inputs.environmental) || 0;

    const traffic =
        Number(inputs.traffic) || 0;

    const infrastructure =
        Number(inputs.infrastructure) || 0;

    const disaster =
        Number(inputs.disaster) || 0;

    const sustainability =
        Number(inputs.sustainability) || 0;

    const overall =
        (
            environmental +
            traffic +
            infrastructure +
            disaster +
            sustainability
        ) / 5;

    const result = {
        environmental,
        traffic,
        infrastructure,
        disaster,
        sustainability,
        overall
    };

    updateImpactBars(result);

    // Call backend API for validated indicators & qualitative summary
    fetchImpactAnalysisBackend(result);

    return result;
}


function updateImpactBars(data) {
    updateBar(
        "environmentBar",
        data.environmental
    );

    updateBar(
        "trafficBar",
        data.traffic
    );

    updateBar(
        "infrastructureBar",
        data.infrastructure
    );

    updateBar(
        "disasterBar",
        data.disaster
    );

    updateBar(
        "sustainabilityBar",
        data.sustainability
    );

    // Update score indicator
    const overallScoreEl = document.getElementById("impactOverallScore");
    if (overallScoreEl) {
        overallScoreEl.textContent = `${data.overall.toFixed(1)} / 100`;
    }
}


function updateBar(id, value) {
    const bar = document.getElementById(id);

    if (bar) {
        bar.style.width =
            `${Math.min(Math.max(value, 0), 100)}%`;
    }

    const label = document.getElementById(`${id}Value`);
    if (label) {
        label.textContent = `${Math.round(value)}%`;
    }
}


async function fetchImpactAnalysisBackend(payload) {
    const statusEl = document.getElementById("impactStatus");
    const summaryEl = document.getElementById("impactSummaryText");
    const ratingEl = document.getElementById("impactRatingBadge");
    const noticeEl = document.getElementById("impactSimulationNotice");

    if (statusEl) {
        statusEl.innerHTML = '<span class="status-indicator loading">📊 Synthesizing impact models with backend...</span>';
    }

    try {
        const baseUrl = getImpactApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/impact`, {
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
            updateImpactBars(data);

            if (ratingEl && data.rating) {
                ratingEl.textContent = data.rating;
                ratingEl.className = "tag";
                if (data.overall >= 75) {
                    ratingEl.style.background = "var(--sage-light)";
                    ratingEl.style.color = "var(--sage-dark)";
                } else if (data.overall >= 55) {
                    ratingEl.style.background = "var(--yellow-light)";
                    ratingEl.style.color = "#806f39";
                } else {
                    ratingEl.style.background = "var(--peach-light)";
                    ratingEl.style.color = "#925e49";
                }
            }

            if (summaryEl && data.summary) {
                summaryEl.textContent = data.summary;
            }

            if (noticeEl && data.simulationNotice) {
                noticeEl.textContent = `* ${data.simulationNotice}`;
            }

            if (statusEl) {
                statusEl.innerHTML = '<span class="status-badge status-good">✅ Backend Impact Assessment Synced</span>';
            }
        }

    } catch (err) {
        console.error("Impact API Error:", err);
        if (statusEl) {
            statusEl.innerHTML = '<span class="status-badge status-warning">⚠️ Using local impact values (Backend offline)</span>';
        }
    }
}

// Bind event listeners
document.addEventListener("DOMContentLoaded", () => {
    function readImpactInputs() {
        return {
            environmental: document.getElementById("inputEnvImpact")?.value || 65,
            traffic: document.getElementById("inputTrafficImpact")?.value || 55,
            infrastructure: document.getElementById("inputInfraImpact")?.value || 70,
            disaster: document.getElementById("inputDisasterImpact")?.value || 40,
            sustainability: document.getElementById("inputSustainImpact")?.value || 75
        };
    }

    const impactInputs = [
        "inputEnvImpact", "inputTrafficImpact", "inputInfraImpact",
        "inputDisasterImpact", "inputSustainImpact"
    ];

    impactInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                const inputs = readImpactInputs();
                const overall = (Number(inputs.environmental) + Number(inputs.traffic) +
                                 Number(inputs.infrastructure) + Number(inputs.disaster) +
                                 Number(inputs.sustainability)) / 5;
                updateImpactBars({ ...inputs, overall });
            });
            el.addEventListener("change", () => calculateImpactAnalysis(readImpactInputs()));
        }
    });

    const calcBtn = document.getElementById("btnCalculateImpact");
    if (calcBtn) {
        calcBtn.addEventListener("click", () => calculateImpactAnalysis(readImpactInputs()));
    }
});