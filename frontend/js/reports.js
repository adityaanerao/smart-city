async function generateReport() {

    const reportData = {

        generatedAt:
            new Date().toISOString(),

        project:
            document.getElementById("projectName")?.value ||
            "Smart City Project",

        siteArea:
            document.getElementById("siteArea")?.textContent ||
            "Not available",

        greenArea:
            document.getElementById("greenArea")?.textContent ||
            "Not available",

        disasterRisk:
            document.getElementById("riskLevel")?.textContent ||
            "Not available",

        totalCost:
            document.getElementById("totalCost")?.textContent ||
            "Not available"
    };

    try {

        const response = await fetch(
            "/api/reports/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(reportData)
            }
        );

        if (!response.ok) {
            throw new Error("Report generation failed.");
        }

        const result = await response.json();

        console.log("Report generated:", result);

        if (typeof showNotification === "function") {
            showNotification("Report generated successfully!");
        }

    } catch (error) {

        console.error(error);

        if (typeof showNotification === "function") {
            showNotification(
                "Report service is not connected yet.",
                "error"
            );
        }
    }
}