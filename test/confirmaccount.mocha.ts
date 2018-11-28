import "mocha";
import * as chai from 'chai';
import * as http from "http";
import * as mongoose from "mongoose";
import * as cap from "chai-as-promised";
import * as request from "supertest-as-promised";
import { bootstrap } from "../src/index";
import { REGISTER_USER } from "./mocks/mocks";

// find one document from provided collection and query
const findOne = (collectionName, query) => {
    return new Promise( (resolve, reject) =>
        mongoose.connection.db.collection(collectionName, (err, collection) => {
        if (err) {
            reject(err);
        }
        collection.find(query).toArray((error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data[0]);
        });
    }));

};

const expect = chai.expect;

chai.use(cap);
describe('Confirm Email Account Controller', () => {
    let server: http.Server = null;

    before(async () => {
        server = await bootstrap();
    });

    after( async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await server.close();
    });

    it("GET - Missing verification id - No handler", () => {
        return request(server)
            .get(`/api/v1/email-verification`)
            .expect(404);
    });

    it("GET - request validation error - min length", () => {
        return request(server)
            .get(`/api/v1/email-verification/abcd123456abcd12345`)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "params",
                                param: "id",
                                value: "abcd123456abcd12345",
                                msg: "Invalid verification ID provided",
                            },
                        ],
                    });
            });
    });

    it("GET - request validation error - max length", () => {
        return request(server)
            .get(`/api/v1/email-verification/abcd123456abcd1234567`)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal(
                    {
                        errors: [
                            {
                                location: "params",
                                param: "id",
                                value: "abcd123456abcd1234567",
                                msg: "Invalid verification ID provided",
                            },
                        ],
                    });
            });
    });

    it("GET - invalid verification id - invalid request to confirm email", () => {
        return request(server)
            .get(`/api/v1/email-verification/abcd123456abcd123456`)
            .expect(400)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.errorMessage).to.be.equal("Invalid/Expired Verification Id");
            });
    });

    it("GET - request email account confirmation", async () => {

        // register a user
        await request(server)
            .post(`/api/v1/sign-up`)
            .send(REGISTER_USER);

        const user: any = await findOne("temporary_users", { email: "firstname.lastname@gmail.com" });

        // request for resend email
        return request(server)
            .get(`/api/v1/email-verification/${user.GENERATED_VERIFYING_URL}`)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body.message).to.equal("Successfully confirmed the User Email Account");
            });
    });

});
