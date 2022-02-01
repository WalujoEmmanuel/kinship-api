const supertest = require("supertest");

const baseUrl = "http://localhost:6900/api";

const request = supertest(baseUrl);

// *** Test API welcome message *** //

describe("API works", function () {

  it('Should return "Welcome to Kinship API Version 1.0" welcomeMessage query', (done) => {
    request
    .post("/")
    .send({ query: `{ welcomeMessage }` })
    .set("Accept", "application/json")
    .expect(200)
    .end((err, res) => {
      if(err) return done(err)
      expect(res.body.data.welcomeMessage).toBe("Welcome to Kinship API Version 1.0");
      done();
    })
  });
});
