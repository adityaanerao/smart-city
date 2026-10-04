const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/infrastructure",
    require("./routes/infrastructure"));

app.use("/api/green-city",
    require("./routes/greenCity"));

app.use("/api/disaster",
    require("./routes/disaster"));

app.use("/api/environment",
    require("./routes/environment"));

app.use("/api/impact",
    require("./routes/impact"));

app.listen(5000, () => {
    console.log("Backend running on port 5000");
});