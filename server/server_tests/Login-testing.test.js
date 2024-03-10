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

server = app.listen(() => {
    console.log(`Server is running on ${port} `);
});

describe("Already Existing User Logs in The Software", () => {
    test("should respond with 200 status code", async () => {
        const response = await request(server).post("/auth/login").send({
            email: "Test_User_1@gmail.com",
            password: "123456",
        });
        expect(response.statusCode).toBe(200);
    });
});

describe("Not Existing User Tries To Log in The Software", () => {
    test("should respond with 400 status code", async () => {
        const response = await request(server).post("/auth/login").send({
            email: "Test_User_NotExist@gmail.com",
            password: "123456",
        });
        expect(response.statusCode).toBe(400);
    });
});

describe("When an email or password is missing", () => {
    test("should respond with 400 status code if email is missing", async () => {
        const response = await request(server).post("/auth/login").send({
            password: "password",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if password is missing", async () => {
        const response = await request(server).post("/auth/login").send({
            email: "email",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if email and password are missing", async () => {
        const response = await request(server).post("/auth/login").send({});
        expect(response.statusCode).toBe(400);
    });
});

server.close();
