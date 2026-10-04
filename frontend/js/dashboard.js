document.addEventListener("DOMContentLoaded", () => {

    loadSiteData();

});


function loadSiteData() {

    const savedData =
        localStorage.getItem("smartCitySite");

    if (!savedData) {
        console.log("No site data found.");
        return;
    }


    const siteData =
        JSON.parse(savedData);


    // Infrastructure

    setText(
        "infrastructureType",
        siteData.infrastructure
    );


    // Location

    setText(
        "siteLocation",
        siteData.location
    );


    // Site Area

    if (siteData.siteArea) {

        setText(
            "siteArea",
            `${siteData.siteArea} Acres`
        );

    }


    // Population / users

    if (siteData.population) {

        setText(
            "population",
            Number(
                siteData.population
            ).toLocaleString("en-IN")
        );

    }


    // Development type

    setText(
        "developmentType",
        siteData.developmentType === "new"
            ? "New Development"
            : "Existing Site Improvement"
    );

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}