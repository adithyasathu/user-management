import "mocha";
import * as chai from 'chai';
import * as http from "http";
import * as mongoose from "mongoose";
import * as cap from "chai-as-promised";
import * as request from "supertest-as-promised";
import { bootstrap } from "../src/index";
import { REGISTER_USER } from "./mocks/mocks";

const expect = chai.expect;

chai.use(cap);
// tslint:disable:only-arrow-functions
describe('Resend Email Verification Controller', () => {
    let server: http.Server = null;

    before(async () => {
        server = await bootstrap();
    });

    after( async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it("POST - Missing email - invalid request to resend email", () => {
        // tslint:disable: no-unused-variable
        return request(server)
            .post(`/api/v1/resend-email`)
            .send({emailId: "firstname.lastname@gmail.com"})
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal({
                    errors: [
                        {
                            location: "body",
                            param: "email",
                            msg: "Invalid Email is provided",
                        },
                    ],
                });
            });
    });

    it("POST - request to resend to non registered email ", () => {
        return request(server)
            .post(`/api/v1/resend-email`)
            .send({email: "firstname@gmail.com"})
            .expect(500)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.errorMessage).to.equal("user not found for email-id provided");
            });
    });

    it("POST - request to resend email ", async () => {

        // register a user
        await request(server)
            .post(`/api/v1/sign-up`)
            .send(REGISTER_USER);
        // request for resend email
        return request(server)
            .post(`/api/v1/resend-email`)
            .send({email: "firstname.lastname@gmail.com"})
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.message).to.equal("An email has been sent to you, yet again. Please check it to verify your account");
            });
    });

 });
