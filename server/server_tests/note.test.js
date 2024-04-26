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

describe("Tests for get_all_notes", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).get("/note/all").send({});
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 200 status code and give all notes when correct userId given", async () => {
    const response = await request(server).get("/note/all").send({
      userId: "66165ce6fba86a331f027edb",
    });
    const dummyNote = {
      title: "Dummy Fav Note",
      body: "This is a dummy favourite note.",
      videoId: "myfavouritevideo.com",
    };
    expect(response.statusCode).toBe(200);
    expect(response._body).toEqual(
      expect.objectContaining({
        notes: expect.arrayContaining([expect.objectContaining(dummyNote)]),
      })
    );
  });
});

describe("Tests For getNote", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).get("/note/one");
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 400 status code if videoId is missing", async () => {
    const userId = "66165ce6fba86a331f027edb";
    const response = await request(server).get("/note/one").send({
      userId: userId,
    });
    expect(response.statusCode).toBe(400);
  });

  test("should respond with 200 status code and give correct note when userId given", async () => {
    const userId = "66165ce6fba86a331f027edb";
    const videoId = "youtube.com/ilikethis..maybe?";
    const response = await request(server).get("/note/one").send({
      userId: userId,
      videoId: videoId,
    });
    const dummyNote = {
      title: "Dummy Toggle Note",
      body: "I keep toggling the favourite status of this note.",
      videoId: "youtube.com/ilikethis..maybe?",
    };
    expect(response.statusCode).toBe(200);
    expect(response._body).toEqual(
      expect.objectContaining({
        reqNote: expect.objectContaining(dummyNote),
      })
    );
  });
});

describe("Tests For getFavNotes", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).get("/note/fav");
    expect(response.statusCode).toBe(400);
  });
  test("should respond with 200 status code and give all fav notes when correct userId given", async () => {
    const userId = "66165ce6fba86a331f027edb";
    const response = await request(server).get(`/note/fav?userId=${userId}`);
    const dummyNote = {
      title: "Dummy Fav Note",
      body: "This is a dummy favourite note.",
      videoId: "myfavouritevideo.com",
    };
    expect(response.statusCode).toBe(200);
    expect(response._body).toEqual(
      expect.objectContaining({
        notes: expect.arrayContaining([expect.objectContaining(dummyNote)]),
      })
    );
  });
});

describe("Tests For modifyFavNotes", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).post("/note/getFav").send({});
    expect(response.statusCode).toBe(400);
  });
  test("should respond with 400 status code if videoId is missing", async () => {
    const response = await request(server)
      .post("/note/getFav")
      .send({ userId: "66165ce6fba86a331f027edb" });
    expect(response.statusCode).toBe(400);
  });

  test("should toggle the fav status of the note and return 200 status code", async () => {
    const response = await request(server).post("/note/getFav").send({
      userId: "66165ce6fba86a331f027edb",
      videoId: "youtube.com/ilikethis..maybe?",
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("Tests For createNote", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).post("/note/create").send({});
    expect(response.statusCode).toBe(400);
  });

  test("should save note to database", async () => {
    const response = await request(server)
      .post("/note/create")
      .send({
        userId: "66165ce6fba86a331f027edb",
        videoId: "youtube.com/abcdef",
        note: { title: "Dummy Note", body: "This is a dummy note." },
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Tests For deleteNote", () => {
  test("should respond with 400 status code if User_ID is missing", async () => {
    const response = await request(server).delete("/note/delete").send({});
    expect(response.statusCode).toBe(400);
  });

  test("should delete note in the database", async () => {
    const response = await request(server).delete("/note/delete").send({
      userId: "66165ce6fba86a331f027edb",
      videoId: "youtube.com/abcdef",
    });
    console.log(response._body);
    expect(response.statusCode).toBe(200);
  });

});

server.close();
