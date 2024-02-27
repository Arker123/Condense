const {
    fetch_All_summaries,
    fetch_One_summary,
    fetch_fav_summaries,
    modify_fav_summaries,
    save_summary
} = require("../controllers/summary")

const express = require("express");

const Router = express.Router();

Router.post("/modifyFav", modify_fav_summaries);
Router.get("/getAll", fetch_All_summaries);
Router.get("/getFav", fetch_fav_summaries);
Router.get("/getOne", fetch_One_summary);
Router.post("/save", save_summary);

module.exports = Router;