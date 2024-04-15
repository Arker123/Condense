const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const port = process.env.PORT || 5000;

require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
}, 10000);

afterEach(async () => {
    await mongoose.connection.close();
}, 10000);

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

    test("should respond with 200 status code and give all summaries when correct userId given", async () => {
        const response2 = await request(server).get("/summaries/getAll").send({
            userId: "66165ce6fba86a331f027edb",
        });
        const dummySummary = {
            summary: {
                body: "This is a dummy summary for an amazing youtube video!",
            },
            videoId: "youtube.com/abcdef",
        };
        expect(response2.statusCode).toBe(200);
        expect(response2._body).toEqual(
            expect.arrayContaining([expect.objectContaining(dummySummary)]),
        );
    });
});

describe("Tests For fetch_One_summary", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server).get("/summaries/getOne");
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if videoId is missing", async () => {
        const userId = "66165ce6fba86a331f027edb";
        const response = await request(server).get(
            `/summaries/getOne?userId=${userId}`,
        );
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 200 status code and give correct summary when userId given", async () => {
        const userId = "66165ce6fba86a331f027edb";
        const videoId = "youtube.com/abcdef";
        const response = await request(server).get(
            `/summaries/getOne?userId=${userId}&videoId=${videoId}`,
        );
        const dummySummary = {
            summary: {
                body: "This is a dummy summary for an amazing youtube video!",
            },
            videoId: "youtube.com/abcdef",
        };
        expect(response.statusCode).toBe(200);
        expect(response._body).toEqual(
            expect.arrayContaining([expect.objectContaining(dummySummary)]),
        );
    });
});

describe("Tests For fetch_fav_summaries", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server)
            .get("/summaries/getFav");
        expect(response.statusCode).toBe(400);
    });
    test("should respond with 200 status code and give all fav summaries when correct userId given", async () => {
        const userId = "66165ce6fba86a331f027edb";
        const response = await request(server).get(
            `/summaries/getFav?userId=${userId}`,
        );
        const dummySummary = {
            summary: { body: "This is a dummy favourite summary!" },
            videoId: "myfavouritevideo.com",
        };
        expect(response.statusCode).toBe(200);
        expect(response._body).toEqual(
            expect.arrayContaining([expect.objectContaining(dummySummary)]),
        );
    });
});

describe("Tests For modify_fav_summaries", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server)
            .post("/summaries/modifyFav")
            .send({});
        expect(response.statusCode).toBe(400);
    });
    test("should respond with 400 status code if videoId is missing", async () => {
        const response = await request(server)
            .post("/summaries/modifyFav")
            .send({ userId: "66165ce6fba86a331f027edb" });
        expect(response.statusCode).toBe(400);
    });

    test("should toggle the fav status of the summary and return 200 status code", async () => {
        const response = await request(server)
            .post("/summaries/modifyFav")
            .send({
                userId: "66165ce6fba86a331f027edb",
                videoId: "youtube.com/ilikethis..maybe?",
            });
        expect(response.statusCode).toBe(200);
    });
});

describe("Tests For save_summary", () => {
    test("should respond with 400 status code if User_ID is missing", async () => {
        const response = await request(server).post("/summaries/save").send({});
        expect(response.statusCode).toBe(400);
    });

    test("should save summary to database and be included in the get(/summaries/getAll) request", async () => {
        const response = await request(server).post("/summaries/save").send({
            userId: "66165ce6fba86a331f027edb",
            videoId: "youtube.com/abcdef",
            summaryBody:
                "This is a dummy summary for an amazing youtube video!",
        });
        expect(response.statusCode).toBe(200);
        const response2 = await request(server).get("/summaries/getAll").send({
            userId: "66165ce6fba86a331f027edb",
        });
        const dummySummary = {
            summary: {
                body: "This is a dummy summary for an amazing youtube video!",
            },
            videoId: "youtube.com/abcdef",
        };
        expect(response2.statusCode).toBe(200);
        expect(response2._body).toEqual(
            expect.arrayContaining([expect.objectContaining(dummySummary)]),
        );
    });
});

server.close();
