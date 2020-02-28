const app = require('../server');
const request = require("supertest");

describe('Test server.js...', ()=>{
   test('It should response to the default GET method', () => {
      return request(app).get("/").then(response => {
         expect(response.statusCode).toBe(200)
      })
   });
});