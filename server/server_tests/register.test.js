const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const port = process.env.PORT || 5000;
const { registerUser } = require("../controllers/auth.js");
const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
jest.mock("../models/UserModel.js");
jest.mock("bcrypt");

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

describe("If User tries to Register ", () => {
    test("User already exists, should respond with 400 status code", async () => {
        User.findOne.mockImplementation(() => ({
            name: "name",
            email: "Test_User_1@gmail.com",
            password: "123456",
        }));
        const response = await request(server).post("/auth/register").send({
            name: "name",
            email: "Test_User_1@gmail.com",
            password: "123456",
        });
        expect(response.statusCode).toBe(400);
    });
    test("Valid new user, should respond with 200 status code and create user", async () => {
        const request = {
            body: {
                name: "Tester Man",
                email: "tests@gmail.com",
                password: "123456",
            },
        };
        const response = {
            status: jest.fn(() => response),
            cookie: jest.fn((x) => x),
            json: jest.fn((x) => x),
        };
        User.findOne.mockImplementation(() => undefined); // or mockResolvedValueOnce(undefined)
        User.create.mockImplementationOnce(() => ({
            _id: "randomID",
            _doc: {
                name: "Tester Man",
                email: "tests@gmail.com",
                password: "123456",
            },
        }));
        bcrypt.hash.mockReturnValueOnce("Hash");
        await registerUser(request, response);
        expect(User.create).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(200);
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
