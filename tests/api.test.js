import request from "supertest";
import app from "../app";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNha2lsYSIsImlhdCI6MTY2OTYyMjExNywiZXhwIjoxNjY5Nzk0OTE3fQ.2vVC4MKn672faHtSS4PhUTgqB7GkHDHxQQbnOxC19vQ'

describe("POST auth", () => {
    describe("given a username and password", () => {
  
        test("Should respond with 200", async () => {
            const response = await request(app).post("/api/auth/login").set('Authorization', `Bearer ${token}`).send({
              username: "sakila",
              password: "123456"
            });
            expect(response.statusCode).toBe(200);
          //   expect(response.body['auth-token']).toBeDefined();
          });
          test("Should have auth token in response body", async () => {
              const response = await request(app).post("/api/auth/login").set('Authorization', `Bearer ${token}`).send({
                username: "sakila",
                password: "123456"
              });
              expect(response.body['auth-token']).toBeDefined();
          });
    })
  
    describe("when the username and password is missing", () => {
      test("should respond with a status code of 400", async () => {
        const bodyObject = [
          {username: "username"},
          {password: "password"},
          {}
        ]
        for (const bodyItem of bodyObject) {
          const response = await request(app).post("/api/auth/login").send(bodyItem)
          expect(response.statusCode).toBe(400)
        }
      })
    })
  
})

describe("GET getstudentdata", () => {

      describe("Normal request without token", () => {
      
        test("Should respond with 403", async () => {
            const response = await request(app).get("/api/data/getstudentdata").send();
            expect(response.statusCode).toBe(403);
          });

        
    })


    describe("Normal request without filters with token", () => {
  
        test("Should respond with 200", async () => {
            const response = await request(app).get("/api/data/getstudentdata").set('Authorization', `Bearer ${token}`).send();
            expect(response.statusCode).toBe(200);
          });

        
    })
  
    describe("When filters provided with token", () => {
      test("should respond with a status code of 200", async () => {
        const response = await request(app).get("/api/data/getstudentdata")
        .query({ student_id: 10 })
        .set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
      })
    })
  
})

describe("GET getstudentprogress", () => {

  describe("Normal request without token", () => {
      
    test("Should respond with 403", async () => {
        const response = await request(app).get("/api/data/getstudentprogress").send();
        expect(response.statusCode).toBe(403);
      });

    
  })

  describe("Normal request without filters with token", () => {

      test("Should respond with 200", async () => {
          const response = await request(app).get("/api/data/getstudentprogress").set('Authorization', `Bearer ${token}`).send();
          expect(response.statusCode).toBe(200);
        });

      
  })

  describe("When filters provided with token", () => {
    test("should respond with a status code of 200", async () => {
      const response = await request(app).get("/api/data/getstudentprogress")
      .query({ student_id: 10 })
      .set('Authorization', `Bearer ${token}`).send();
      expect(response.statusCode).toBe(200);
    })
  })

})