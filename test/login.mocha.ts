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
describe('Login Controller', () => {
    let server: http.Server = null;

    before(async () => {
        server = await bootstrap();
    });

    after( async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it("POST - Missing request - invalid request to login the user ", () => {
        return request(server)
            .post(`/api/v1/login`)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "body",
                                msg: "Invalid Email is provided",
                                param: "email",
                            },
                            {
                                location: "body",
                                msg: "Password is required",
                                param: "password",
                            },
                        ],
                    });
            });
    });

    it("POST - Missing email in request - invalid request to login the user ", () => {
        return request(server)
            .post(`/api/v1/login`)
            .send({password: "superpass"})
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "body",
                                msg: "Invalid Email is provided",
                                param: "email",
                            },
                        ],
                    });
            });
    });

    it("POST - Missing password in request - invalid request to login the user ", () => {
        return request(server)
            .post(`/api/v1/login`)
            .send({email: "firstname@gmail.com"})
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "body",
                                msg: "Password is required",
                                param: "password",
                            },
                        ],
                    });
            });
    });

    it("POST - Invalid user email in request - invalid request to login the user ", async () => {

        return request(server)
            .post(`/api/v1/login`)
            .send({email: "nouser@gmail.com", password: "wrongpass"})
            .expect(401)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.errorMessage).to.be.equal("no user with email id provided");
            });
    });

    it("POST - Invalid Credentials in request - invalid request to login the user ", async () => {

        await new User(ACTIVE_USER).save();

        return request(server)
            .post(`/api/v1/login`)
            .send({email: "firstname.lastname@gmail.com", password: "wrongpass"})
            .expect(401)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.errorMessage).to.be.equal("invalid credentials");
            });
    });

    it("POST - valid request to login the user ", async () => {

        await new User(ACTIVE_USER).save();

        return request(server)
            .post(`/api/v1/login`)
            .send({email: "firstname.lastname@gmail.com", password: "superpass"})
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.email).to.be.equal("firstname.lastname@gmail.com");
                expect(res.body.expiresInSec).to.be.equal(600);
                expect(res.body.token).to.not.be.null;
            });
    });

});
