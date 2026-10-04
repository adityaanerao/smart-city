const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Disaster analysis API is working"
    });
});

module.exports = router;