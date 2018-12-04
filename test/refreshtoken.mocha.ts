import "mocha";
import * as chai from 'chai';
import * as http from "http";
import * as mongoose from "mongoose";
import * as cap from "chai-as-promised";
import * as request from "supertest-as-promised";
import { bootstrap } from "../src/index";
import {User} from "../src/models/user";
import {ACTIVE_USER} from "./mocks/mocks";

const expect = chai.expect;

chai.use(cap);
describe('Refresh Token Controller', () => {
    let server: http.Server = null;

    before(async () => {
        server = await bootstrap();
    });

    after( async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it("GET - Missing Token ", () => {
        return request(server)
            .get(`/api/v1/refresh-token`)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "headers",
                                msg: "Valid Authorization Token is required",
                                param: "authorization",
                            },
                        ],
                    });
            });
    });

    it("GET - Invalid Token ", () => {
        return request(server)
            .get(`/api/v1/refresh-token`)
            .set('Authorization', 'token007')
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "headers",
                                msg: "Valid Authorization Token is required",
                                param: "authorization",
                                value: "token007",
                            },
                        ],
                    });
            });
    });

    it("GET - Malformed Token ", () => {
        return request(server)
            .get(`/api/v1/refresh-token`)
            .set('Authorization', 'Bearer token007')
            .expect(401)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errorMessage: "jwt malformed",
                    });
            });
    });

    it("GET - Expired Token ", () => {
        return request(server)
            .get(`/api/v1/refresh-token`)
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0bmFtZS5sYXN0bmFtZUBnbWFpbC5jb20iLCJ0aW1lc3RhbXAiOjE1NDM4MDcyMzE2ODcsImlhdCI6MTU0MzgwNzIzMSwiZXhwIjoxNTQzODA3ODMxfQ.EoZWV5eQjiT5eP-eUn3Sqx5UqWDjyj83qVD5ityD9t0')
            .expect(401)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errorMessage: "jwt expired",
                    });
            });
    });

    it("GET - Invalid Token ", () => {
        return request(server)
            .get(`/api/v1/refresh-token`)
            .set('Authorization', 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0bmFtZS5sYXN0bmFtZUBnbWFpbC5jb20iLCJ0aW1lc3RhbXAiOjE1NDM4MDcyMzE2ODcsImlhdCI6MTU0MzgwNzIzMSwiZXhwIjoxNTQzODA3ODMxfQ.EoZWV5eQjiT5eP-eUn3Sqx5UqWDjyj83qVD5ityD9t0')
            .expect(401)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errorMessage: "invalid token",
                    });
            });
    });

    it("GET - Valid Token - Refreshed", async () => {

        await new User(ACTIVE_USER).save();

        const signIn = await request(server)
            .post(`/api/v1/login`)
            .send({email: "firstname.lastname@gmail.com", password: "superpass"});

        return request(server)
            .get(`/api/v1/refresh-token`)
            .set('Authorization', `Bearer ${signIn.body.token}`)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.expiresInSec).to.be.eq(600);
                expect(res.body.token).to.not.be.null;
                expect(res.body.email).to.be.equal("firstname.lastname@gmail.com");
            });
    });

});
