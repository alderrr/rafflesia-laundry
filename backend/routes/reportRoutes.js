const express = require("express");

const { getTodayReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/today", getTodayReport);

module.exports = router;
