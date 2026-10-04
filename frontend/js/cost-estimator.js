// ============================================================================
// INFRASTRUCTURE COST ESTIMATOR
// ============================================================================

function getCostApiBaseUrl() {
    if (window.location.hostname === "10.70.80.81") {
        return "http://10.70.80.81:5001";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://10.70.80.81:5001";
}

function calculateInfrastructureCost() {
    const roadCost =
        Number(document.getElementById("roadCost")?.value) || 0;

    const buildingCost =
        Number(document.getElementById("buildingCost")?.value) || 0;

    const waterCost =
        Number(document.getElementById("waterCost")?.value) || 0;

    const electricalCost =
        Number(document.getElementById("electricalCost")?.value) || 0;

    const drainageCost =
        Number(document.getElementById("drainageCost")?.value) || 0;

    const greenCost =
        Number(document.getElementById("greenCost")?.value) || 0;

    const total =
        roadCost +
        buildingCost +
        waterCost +
        electricalCost +
        drainageCost +
        greenCost;

    displayTotalCost(total);

    // Also trigger backend calculation & validation
    calculateCostOnBackend({
        roadCost,
        buildingCost,
        waterCost,
        electricalCost,
        drainageCost,
        greenCost
    });

    return {
        roadCost,
        buildingCost,
        waterCost,
        electricalCost,
        drainageCost,
        greenCost,
        total
    };
}


function displayTotalCost(total) {
    const element =
        document.getElementById("totalCost");

    if (element) {
        element.textContent =
            `₹ ${total.toLocaleString("en-IN")}`;
    }
}


async function calculateCostOnBackend(costPayload) {
    const statusEl = document.getElementById("costStatus");
    const errorEl = document.getElementById("costError");

    if (statusEl) {
        statusEl.innerHTML = '<span class="status-indicator loading">⏳ Calculating & validating with backend...</span>';
    }
    if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
    }

    try {
        const baseUrl = getCostApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/cost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(costPayload)
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            displayTotalCost(data.total);

            if (statusEl) {
                statusEl.innerHTML = `
                    <span class="status-badge status-good">
                        ✅ Backend Validated Total: ₹ ${Number(data.total).toLocaleString("en-IN")}
                    </span>
                `;
            }

            // Display breakdown percentages if container exists
            const breakdownEl = document.getElementById("costBreakdown");
            if (breakdownEl && data.breakdown) {
                breakdownEl.innerHTML = `
                    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; font-size:0.85rem;">
                        <span class="tag">🛣️ Road: ${data.breakdown.road}%</span>
                        <span class="tag">🏢 Building: ${data.breakdown.building}%</span>
                        <span class="tag">💧 Water: ${data.breakdown.water}%</span>
                        <span class="tag">⚡ Electrical: ${data.breakdown.electrical}%</span>
                        <span class="tag">🚰 Drainage: ${data.breakdown.drainage}%</span>
                        <span class="tag">🌳 Green: ${data.breakdown.green}%</span>
                    </div>
                `;
            }
        } else {
            throw new Error(data.error || "Backend cost calculation failed");
        }

    } catch (err) {
        console.error("Cost Estimator API Error:", err);
        if (statusEl) {
            statusEl.innerHTML = "";
        }
        if (errorEl) {
            errorEl.style.display = "block";
            errorEl.textContent = `⚠️ Backend unavailable (${err.message}). Displaying local estimate.`;
        }
    }
}

// Auto-bind input listeners once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const costInputs = [
        "roadCost", "buildingCost", "waterCost",
        "electricalCost", "drainageCost", "greenCost"
    ];

    costInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", () => {
                // Local instant calculation on keystroke
                const roadCost = Number(document.getElementById("roadCost")?.value) || 0;
                const buildingCost = Number(document.getElementById("buildingCost")?.value) || 0;
                const waterCost = Number(document.getElementById("waterCost")?.value) || 0;
                const electricalCost = Number(document.getElementById("electricalCost")?.value) || 0;
                const drainageCost = Number(document.getElementById("drainageCost")?.value) || 0;
                const greenCost = Number(document.getElementById("greenCost")?.value) || 0;
                const total = roadCost + buildingCost + waterCost + electricalCost + drainageCost + greenCost;
                displayTotalCost(total);
            });
            input.addEventListener("change", calculateInfrastructureCost);
        }
    });

    const calcBtn = document.getElementById("btnCalculateCost");
    if (calcBtn) {
        calcBtn.addEventListener("click", calculateInfrastructureCost);
    }
});