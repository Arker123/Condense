const {
    fetchAllSummaries,
    fetchOneSummary,
    fetchFavSummaries,
    modifyFavSummaries,
    saveSummary,
    generateSummary,
} = require("../controllers/summary");

const express = require("express");
const router = new express.Router();

router.post("/modifyFav", modifyFavSummaries);
router.get("/getAll", fetchAllSummaries);
router.get("/getFav", fetchFavSummaries);
router.get("/getOne", fetchOneSummary);
router.get("/generate", generateSummary);

router.post("/save", saveSummary);

module.exports = router;
