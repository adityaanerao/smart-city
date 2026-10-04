const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Infrastructure API connected!"
    });
});

module.exports = router;