const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const port = process.env.PORT || 5000;

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
}, 30000);

afterEach(async () => {
  await mongoose.connection.close();
}, 30000);

const server = app.listen(() => {
  console.log(`Server is running on ${port} `);
});

describe("Chatbot API is called", () => {
  test("should respond with 400 status code when no summary and question", async () => {
    const response = await request(server).post("/chatbot/generate").send({});
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 400 status code when no question", async () => {
    const summary =
      "India, known for its rich cultural heritage and diverse landscapes, is the seventh-largest country by land area and the second-most populous country in the world. It is renowned for its ancient civilizations, vibrant festivals, and diverse cuisine. India's economy is one of the fastest-growing in the world, driven by industries such as information technology, agriculture, and pharmaceuticals. The country is also known for its contributions to science, mathematics, and spirituality, making it a fascinating blend of tradition and modernity.";
    const response = await request(server)
      .post("/chatbot/generate")
      .send({ summary: summary });
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 200 status code valid summary and question", async () => {
    const summary =
      "India, known for its rich cultural heritage and diverse landscapes, is the seventh-largest country by land area and the second-most populous country in the world. It is renowned for its ancient civilizations, vibrant festivals, and diverse cuisine. India's economy is one of the fastest-growing in the world, driven by industries such as information technology, agriculture, and pharmaceuticals. The country is also known for its contributions to science, mathematics, and spirituality, making it a fascinating blend of tradition and modernity.";
    const question = "What is India known for?";
    const response = await request(server)
      .post("/chatbot/generate")
      .send({ summary: summary, question: question });
    expect(response.statusCode).toBe(200);
  });
});

server.close();
