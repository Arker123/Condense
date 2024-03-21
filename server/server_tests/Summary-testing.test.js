const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const port = process.env.PORT || 5000;

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
});

const server = app.listen(() => {
  console.log(`Server is running on ${port} `);
});

describe("Tests For fetch_All_summaries", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).get("/summaries/getAll").send({});
    expect(response.statusCode).toBe(400);
  });
  test("should respond with 200 status code and give all summaries when correct userId given", async () => {
    const response2 = await request(server).get("/summaries/getAll").send({
      userId: "65ef4fd63ae8ba6151a918d8",
    });
    const dummySummary = {
      summary: { body: "This is a dummy summary!" },
      videoId: "12ka4",
    };
    expect(response2.statusCode).toBe(200);
    expect(response2._body).toEqual(
      expect.arrayContaining([expect.objectContaining(dummySummary)])
    );
  });
});

describe("Tests For fetch_One_summary", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).get("/summaries/getOne").send({});
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 400 status code if summaryId is missing", async () => {
    const response = await request(server)
      .get("/summaries/getOne")
      .send({ userId: "65ef4fd63ae8ba6151a918d8" });
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 200 status code and give correct summary when userId given", async () => {
    const response = await request(server).get("/summaries/getOne").send({
      userId: "65ef4fd63ae8ba6151a918d8",
      summaryId: "65f8411537238b8f0d969c4e",
    });
    const dummySummary = {
      summary: { body: "This is a dummy summary!" },
      videoId: "12ka4",
    };
    expect(response.statusCode).toBe(200);
    expect(response._body).toEqual(
      expect.arrayContaining([expect.objectContaining(dummySummary)])
    );
  });
});

describe("Tests For fetch_fav_summaries", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).get("/summaries/getFav").send({});
    expect(response.statusCode).toBe(400);
  });
  test("should respond with 200 status code and give all summaries when correct userId given", async () => {
    const response = await request(server).get("/summaries/getFav").send({
      userId: "65ef4fd63ae8ba6151a918d8",
    });
    const dummySummary = {
      summary: { body: "This is a dummy favourite summary!" },
      videoId: "myfavouritevideo.com",
    };
    expect(response.statusCode).toBe(200);
    expect(response._body).toEqual(
      expect.arrayContaining([expect.objectContaining(dummySummary)])
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
  test("should respond with 400 status code if summaryId is missing", async () => {
    const response = await request(server)
      .post("/summaries/modifyFav")
      .send({ userId: "65ef4fd63ae8ba6151a918d8" });
    expect(response.statusCode).toBe(400);
  });

  test("should toggle the fav status of the summary and return 200 status code", async () => {
    const response = await request(server).post("/summaries/modifyFav").send({
      userId: "65ef4fd63ae8ba6151a918d8",
      summaryId: "65fbbe75ec8e1aa22942a11d",
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
      userId: "65ef4fd63ae8ba6151a918d8",
      videoId: "12ka4",
      summaryBody: "This is a dummy summary! Successful.",
    });
    // console.log("Response:",response);
    const response2 = await request(server).get("/summaries/getAll").send({
      userId: "65ef4fd63ae8ba6151a918d8",
    });
    const dummySummary = {
      summary: { body: "This is a dummy summary! Successful." },
      videoId: "12ka4",
    };
    expect(response2.statusCode).toBe(200);
    expect(response2._body).toEqual(
      expect.arrayContaining([expect.objectContaining(dummySummary)])
    );
  });
});

server.close();

