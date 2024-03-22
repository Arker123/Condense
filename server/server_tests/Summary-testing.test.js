const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const port = process.env.PORT || 5000;

require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
},10000);

afterEach(async () => {
    await mongoose.connection.close();
},10000);

const server = app.listen(() => {
    console.log(`Server is running on ${port} `);
});

describe("Tests For fetch_All_summaries", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server)
            .get("/summaries/getAll")
            .send({});
        expect(response.statusCode).toBe(400);
    });
});

describe("Tests For fetch_One_summary", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server)
            .get("/summaries/getOne")
            .send({});
        expect(response.statusCode).toBe(400);
    });
});

describe("Tests For fetch_fav_summaries", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server)
            .get("/summaries/getFav")
            .send({});
        expect(response.statusCode).toBe(400);
    });
});

describe("Tests For modify_fav_summaries", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server)
            .post("/summaries/modifyFav")
            .send({});
        expect(response.statusCode).toBe(400);
    });
});

describe("Tests For save_summary", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server).post("/summaries/save").send({});
        expect(response.statusCode).toBe(400);
    });
});
server.close();
