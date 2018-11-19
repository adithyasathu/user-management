import "mocha";
import * as chai from 'chai';
import * as http from "http";
import * as mongoose from "mongoose";
import {Server} from "../src/server";
import {User} from "../src/models/user";
import * as cap from "chai-as-promised";
import {REGISTER_USER} from "./mocks/mocks";
import * as request from "supertest-as-promised";
import {mongoInit, registrationClientInit} from "../src/index";

const expect = chai.expect;

chai.use(cap);
describe('Registration Controller', () => {
    let server: http.Server = null;

    before(async () => {
        await mongoInit();
        await registrationClientInit();
        server = await new Server().start();
    });

    after( async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it("POST - Missing firstName - invalid request to register the user ", () => {
        // tslint:disable: no-unused-variable
        const {firstName, ...rest} = REGISTER_USER;
        return request(server)
            .post(`/api/v1/sign-up`)
            .send(rest)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal({
                    errors: [
                        {
                            location: "body",
                            param: "firstName",
                            msg: "firstName is required",
                        },
                    ],
                });
            });
    });

    it("POST - Missing body - invalid request to register the user ", () => {
        // tslint:disable: no-unused-variable
        return request(server)
            .post(`/api/v1/sign-up`)
            .send({})
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal({
                    errors: [
                        {
                            location: "body",
                            param: "firstName",
                            msg: "firstName is required",
                        },
                        {
                            location: "body",
                            param: "lastName",
                            msg: "lastName is required",
                        },
                        {
                            location: "body",
                            param: "email",
                            msg: "No/Invalid Email is provided",
                        },
                        {
                            location: "body",
                            param: "password",
                            msg: "Minimum 6 characters required",
                        },
                    ],
                });
            });
    });

    it("POST - request to register the user ", () => {
            return request(server)
                .post(`/api/v1/sign-up`)
                .send(REGISTER_USER)
                .expect(200)
                .then((res) => {
                    expect(res.body).to.not.be.null;
                    expect(res.body.msg).to.equal("An email has been sent to you. Please check it to verify your account.");
                });
    });

    it("Re POST - request to register the user again", () => {
        return request(server)
            .post(`/api/v1/sign-up`)
            .send(REGISTER_USER)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.errorMessage).to.equal("You have already signed up. Please check your email to verify your account.");
            });
    });

    it("Re POST - request to register the active user", async () => {

        await new User(REGISTER_USER).save();

        return request(server)
            .post(`/api/v1/sign-up`)
            .send(REGISTER_USER)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.errorMessage).to.equal("You have already signed up and confirmed your account. Did you forget your password?");
            });
    });

});
