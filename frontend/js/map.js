let smartCityMap = null;

function initializeMap(latitude = 18.5204, longitude = 73.8567) {

    const mapContainer =
        document.getElementById("siteMap") ||
        document.getElementById("map");

    if (!mapContainer) {
        console.error("Map container not found.");
        return;
    }

    smartCityMap = L.map(mapContainer).setView(
        [latitude, longitude],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(smartCityMap);

    L.marker([latitude, longitude])
        .addTo(smartCityMap)
        .bindPopup("📍 Selected Smart City Site")
        .openPopup();
}