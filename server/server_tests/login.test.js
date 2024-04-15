const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const port = process.env.PORT || 5000;
const OTP = require("../models/otpModel.js");
jest.mock("../models/otpModel.js");

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

describe("Already existing tries to login", () => {
  test("should respond with 200 status code when valid email and password", async () => {
    const response = await request(server).post("/auth/login").send({
      email: "testing@gmail.com",
      password: "testing",
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

describe("When you try to generate an OTP", () => {
  test("should respond with 400 status when no email entered", async () => {
    const response = await request(server).post("/auth/otp").send({});
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 200 status and send OTP when valid email entered", async () => {
    OTP.create.mockImplementationOnce(() => ({
      _id: "randomID",
      otp: 123456,
    }));
    const response = await request(server).post("/auth/otp").send({
      email: "test@gmail.com",
    });
    expect(OTP.create).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
  });

  test("should verify OTP when correct OTP entered", async () => {
    OTP.findOne.mockResolvedValueOnce({
      email: "test@gmail.com",
      otp: 654321,
    });
    const response2 = await request(server).post("/auth/verifyOTP").send({
      email: "test@gmail.com",
      otp: 654321,
    });
    expect(response2.statusCode).toBe(200);
  });

  test("should not verify OTP when incorrect OTP entered", async () => {
    OTP.findOne.mockResolvedValueOnce(undefined);
    const response = await request(server).post("/auth/verifyOTP").send({
      email: "test@gmail.com",
      otp: 654321,
    });
    expect(response.statusCode).toBe(400);
  });
});

server.close();
