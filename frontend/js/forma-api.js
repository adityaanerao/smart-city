// ============================================================================
// AUTODESK FORMA INTEGRATION LAYER
// ============================================================================

function getFormaApiBaseUrl() {
    if (window.location.hostname === "10.70.80.81") {
        return "http://10.70.80.81:5001";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://10.70.80.81:5001";
}

const FORMA_API_BASE = "/api/forma";

async function checkFormaStatus() {
    const statusContainer = document.getElementById("formaStatusBadge");
    const guideContainer = document.getElementById("formaInstructions");

    try {
        const baseUrl = getFormaApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/forma/status`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (statusContainer) {
            if (data.configured) {
                statusContainer.innerHTML = '<span class="status-badge status-good">🟢 Autodesk Forma API Connected</span>';
            } else {
                statusContainer.innerHTML = '<span class="status-badge status-warning">⚠️ Autodesk Forma: Prototype Integration Layer (Unconfigured)</span>';
            }
        }

        if (guideContainer && data.setupInstructions && !data.configured) {
            guideContainer.innerHTML = `
                <div style="background:var(--yellow-light); border:1px solid var(--yellow); padding:14px 18px; border-radius:12px; margin-top:10px;">
                    <strong>ℹ️ Autodesk Forma Configuration Notice:</strong>
                    <p style="margin:6px 0 10px; font-size:0.9rem; color:#806f39;">
                        Autodesk Forma integration layer is active. Direct cloud synchronization requires Autodesk Platform Services (APS) API credentials:
                    </p>
                    <ol style="margin-left:20px; font-size:0.85rem; color:#64572b; line-height:1.6;">
                        ${data.setupInstructions.map(step => `<li>${step}</li>`).join("")}
                    </ol>
                </div>
            `;
        }

        return data;

    } catch (err) {
        console.warn("Forma Status Check:", err);
        if (statusContainer) {
            statusContainer.innerHTML = '<span class="status-badge status-warning">ℹ️ Autodesk Forma: Prototype Layer Ready</span>';
        }
        return { configured: false };
    }
}

async function getFormaProject(projectId) {
    try {
        const baseUrl = getFormaApiBaseUrl();
        const response = await fetch(`${baseUrl}${FORMA_API_BASE}/project/${projectId}`);

        const result = await response.json();

        if (!response.ok || !result.configured) {
            console.info("Forma Project Note:", result.note || result.error);
            return result;
        }

        return result;

    } catch (error) {
        console.error("Forma API error:", error);
        return {
            success: false,
            configured: false,
            error: "Unable to retrieve Forma project. Check backend connection."
        };
    }
}

async function getFormaSite(siteId) {
    try {
        const baseUrl = getFormaApiBaseUrl();
        const response = await fetch(`${baseUrl}${FORMA_API_BASE}/site/${siteId}`);

        const result = await response.json();

        if (!response.ok || !result.configured) {
            console.info("Forma Site Note:", result.note || result.error);
            return result;
        }

        return result;

    } catch (error) {
        console.error("Forma site error:", error);
        return {
            success: false,
            configured: false,
            error: "Unable to retrieve Forma site. Check backend connection."
        };
    }
}

async function analyzeFormaSite(siteId) {
    const siteData = await getFormaSite(siteId);

    if (!siteData) {
        return null;
    }

    return {
        site: siteData,
        analyzedAt: new Date().toISOString()
    };
}

document.addEventListener("DOMContentLoaded", () => {
    checkFormaStatus();

    const formaSyncBtn = document.getElementById("btnFormaSync");
    if (formaSyncBtn) {
        formaSyncBtn.addEventListener("click", async () => {
            const projectId = document.getElementById("formaProjectId")?.value || "DEMO-SITE-01";
            const resultBox = document.getElementById("formaSyncResult");
            if (resultBox) {
                resultBox.innerHTML = '<span class="status-indicator loading">📡 Querying Autodesk Forma integration layer...</span>';
            }
            const res = await getFormaProject(projectId);
            if (resultBox) {
                if (!res.configured) {
                    resultBox.innerHTML = `
                        <div style="background:var(--peach-light); color:#925e49; padding:10px 14px; border-radius:10px; margin-top:10px; font-size:0.9rem;">
                            <strong>Prototype Notice:</strong> Forma Project <em>${projectId}</em> integration stub active. ${res.note || "Configure APS credentials in backend/.env for live sync."}
                        </div>
                    `;
                } else {
                    resultBox.innerHTML = `<span class="status-badge status-good">✅ Project ${projectId} Synced</span>`;
                }
            }
        });
    }
});