// ============================================================================
// GREEN CITY PLANNER
// ============================================================================

function getGreenApiBaseUrl() {
    if (window.location.hostname === "10.70.80.81") {
        return "http://10.70.80.81:5001";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://10.70.80.81:5001";
}

function calculateGreenCityScore() {
    const greenArea =
        Number(document.getElementById("greenAreaInput")?.value) || 0;

    const totalArea =
        Number(document.getElementById("totalAreaInput")?.value) || 1;

    const percentage =
        (greenArea / totalArea) * 100;

    updateGreenCityUI(percentage);

    // Call backend API for comprehensive green score & environmental benefits
    fetchGreenCityAnalysis({
        greenArea,
        totalArea,
        trees: Number(document.getElementById("treesInput")?.value) || Math.round(greenArea * 35),
        solarPanels: Number(document.getElementById("solarInput")?.value) || 25,
        waterSaving: document.getElementById("waterSavingInput") ? document.getElementById("waterSavingInput").checked : true,
        wasteManagement: document.getElementById("wasteManagementInput") ? document.getElementById("wasteManagementInput").checked : true
    });

    return percentage;
}


function updateGreenCityUI(percentage) {
    const scoreElement =
        document.getElementById("greenScore");

    const progress =
        document.getElementById("greenProgress");

    if (scoreElement) {
        scoreElement.textContent =
            `${percentage.toFixed(1)}%`;
    }

    if (progress) {
        progress.style.width =
            `${Math.min(Math.max(percentage, 0), 100)}%`;
    }

    // Default local recommendations fallback
    const localRecs = getGreenRecommendations(percentage);
    displayRecommendations(localRecs);
}


function getGreenRecommendations(score) {
    const recommendations = [];

    if (score < 20) {
        recommendations.push(
            "Increase green and open spaces."
        );
    }

    if (score < 30) {
        recommendations.push(
            "Consider additional tree plantation zones."
        );
    }

    recommendations.push(
        "Consider pedestrian and cycling-friendly infrastructure."
    );

    recommendations.push(
        "Evaluate rainwater harvesting opportunities."
    );

    return recommendations;
}


function displayRecommendations(recommendations) {
    const container = document.getElementById("greenRecommendationsList");
    if (!container) return;

    container.innerHTML = "";
    recommendations.forEach(rec => {
        const item = document.createElement("div");
        item.className = "recommendation";
        item.innerHTML = `🌿 ${rec}`;
        container.appendChild(item);
    });
}


async function fetchGreenCityAnalysis(payload) {
    const statusEl = document.getElementById("greenStatus");
    const benefitEl = document.getElementById("environmentalBenefits");

    if (statusEl) {
        statusEl.innerHTML = '<span class="status-indicator loading">🌱 Evaluating sustainability with backend...</span>';
    }

    try {
        const baseUrl = getGreenApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/green-city`, {
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
            // Update UI with backend calculated green score
            const scoreEl = document.getElementById("greenScore");
            if (scoreEl) {
                scoreEl.innerHTML = `${data.greenScore} <span style="font-size:1rem; font-weight:normal;">/ 100 (${data.rating})</span>`;
            }

            const progress = document.getElementById("greenProgress");
            if (progress) {
                progress.style.width = `${Math.min(data.greenScore, 100)}%`;
            }

            const pctEl = document.getElementById("greenPercentage");
            if (pctEl) {
                pctEl.textContent = `${data.sustainabilityPercentage}% Site Coverage`;
            }

            // Display environmental benefits
            if (benefitEl && data.environmentalBenefit) {
                benefitEl.innerHTML = `
                    <div style="background:var(--sage-light); padding:12px 16px; border-radius:12px; margin-top:10px;">
                        <p><strong>💨 Est. CO₂ Absorption:</strong> ~${data.environmentalBenefit.co2ReductionKg.toLocaleString("en-IN")} kg/year</p>
                        <p><strong>🍃 Est. Oxygen Production:</strong> ~${data.environmentalBenefit.oxygenProducedKg.toLocaleString("en-IN")} kg/year</p>
                        <p><strong>🌡️ Heat Island Mitigation:</strong> ${data.environmentalBenefit.heatIslandMitigation}</p>
                        <small style="color:var(--text-light); font-style:italic;">* ${data.simulationNotice}</small>
                    </div>
                `;
            }

            // Display backend recommendations
            if (data.recommendations && data.recommendations.length > 0) {
                displayRecommendations(data.recommendations);
            }

            if (statusEl) {
                statusEl.innerHTML = '<span class="status-badge status-good">✅ Backend Sustainability Analysis Synced</span>';
            }
        }

    } catch (err) {
        console.error("Green City API Error:", err);
        if (statusEl) {
            statusEl.innerHTML = '<span class="status-badge status-warning">⚠️ Using local calculation (Backend offline)</span>';
        }
    }
}

// Bind event listeners
document.addEventListener("DOMContentLoaded", () => {
    const greenInputs = ["greenAreaInput", "totalAreaInput", "treesInput", "solarInput", "waterSavingInput", "wasteManagementInput"];
    greenInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                const greenArea = Number(document.getElementById("greenAreaInput")?.value) || 0;
                const totalArea = Number(document.getElementById("totalAreaInput")?.value) || 1;
                const percentage = (greenArea / totalArea) * 100;
                updateGreenCityUI(percentage);
            });
            el.addEventListener("change", calculateGreenCityScore);
        }
    });

    const calcBtn = document.getElementById("btnCalculateGreen");
    if (calcBtn) {
        calcBtn.addEventListener("click", calculateGreenCityScore);
    }
});