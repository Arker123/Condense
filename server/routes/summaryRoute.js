const {
    fetchAllSummaries,
    fetchOneSummary,
    fetchFavSummaries,
    modifyFavSummaries,
    saveSummary,
} = require("../controllers/summary");

const express = require("express");
const router = new express.Router();

router.post("/modifyFav", modifyFavSummaries);
router.get("/getAll", fetchAllSummaries);
router.get("/getFav", fetchFavSummaries);
router.get("/getOne", fetchOneSummary);
router.post("/save", saveSummary);

module.exports = router;
