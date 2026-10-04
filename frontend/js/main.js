// Set your live backend URL here after deploying to Render/Railway
window.BACKEND_URL = "https://smart-city-3akr.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Smart City application loaded.");

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    setupNavigation();
});


function setupNavigation() {
    const menuButton = document.getElementById("menuButton");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
}


function showNotification(message, type = "success") {
    const notification = document.createElement("div");

    notification.textContent = message;

    notification.style.position = "fixed";
    notification.style.bottom = "25px";
    notification.style.right = "25px";
    notification.style.padding = "15px 20px";
    notification.style.borderRadius = "10px";
    notification.style.color = "white";
    notification.style.zIndex = "9999";
    notification.style.background =
        type === "error" ? "#d9534f" : "#176b5b";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
async function testBackend() {
    try {
        const host = window.location.hostname === "10.70.80.81" ? "10.70.80.81" : (window.location.hostname || "127.0.0.1");
        const response = await fetch(window.BACKEND_URL + "/api/test");
        const data = await response.json();

        console.log("Backend status:", data);
    } catch (error) {
        console.error("Backend connection check:", error);
    }
}

testBackend();