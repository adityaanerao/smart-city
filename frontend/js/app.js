async function getInfrastructureCost(data) {
    const response = await fetch("http://localhost:5001/api/infrastructure", {
     method: "GET"   
    });

    const result = await response.json();
    console.log(result);
}
async function loadInfrastructure() {
    try {
        const response = await fetch(
            window.BACKEND_URL + "/api/infrastructure"
        );

        const data = await response.json();

        console.log("Infrastructure Data:", data);

        document.getElementById("busStations").innerText =
            data.bus_stations;

        document.getElementById("hospitals").innerText =
            data.hospitals;

        document.getElementById("parks").innerText =
            data.parks;

        document.getElementById("schools").innerText =
            data.schools;

    } catch (error) {
        console.error("API Error:", error);
    }
}

loadInfrastructure();