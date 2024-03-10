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

describe("If User is on Register But User Already Exist", () => {
    test("should respond with 400 status code", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "name",
            email: "Test_User_1@gmail.com",
            password: "123456",
        });
        expect(response.statusCode).toBe(400);
    });
});

describe("When a name or email or password is missing", () => {
    test("should respond with 400 status code if name is missing", async () => {
        const response = await request(server).post("/auth/register").send({
            email: "email",
            password: "password",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if email is missing", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "name",
            password: "password",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if password is missing", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "name",
            email: "email",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if name and email are missing", async () => {
        const response = await request(server).post("/auth/register").send({
            password: "password",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if name and password are missing", async () => {
        const response = await request(server).post("/auth/register").send({
            email: "email",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if email and password are missing", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "name",
        });
        expect(response.statusCode).toBe(400);
    });

    test("should respond with 400 status code if all values are missing", async () => {
        const response = await request(server).post("/auth/register").send({});
        expect(response.statusCode).toBe(400);
    });
});

describe("Tests For Send-otp", () => {
    test("should respond with 400 status code if email is missing", async () => {
        const response = await request(server).post("/auth/otp").send({});
        expect(response.statusCode).toBe(400);
    });
});

server.close();
