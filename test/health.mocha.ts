import "mocha";
import * as chai from 'chai';
import * as http from "http";
import { Server } from "../src/server";
import * as cap from "chai-as-promised";
import * as mongoose from "mongoose";
import * as request from "supertest-as-promised";
import { mongoInit } from "../src";
import { IServer } from "../src/types";

const expect = chai.expect;

chai.use(cap);
describe('Health Check Controller', () => {
    let httpServer: http.Server = null;
    let server: IServer = null;

    before(async () => {
        server = new Server();
        httpServer = await server.start();
    });

    after( async () => {
        await mongoose.connection.db.dropDatabase();
        await server.stop();
    });

    it("Get - Calling HealthCheck without mongo connection should return error", () => {

        return request(httpServer)
            .get(`/api/v1/health`)
            .expect(500)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal({
                    errorMessage: "MongoDB isn't connected",
                });
            });
    });

    it("Get - Calling HealthCheck with mongo connection should return success", async () => {

        await mongoInit();

        return request(httpServer)
            .get(`/api/v1/health`)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.null;
                expect(res.body).to.deep.equal({
                    message: 'Server is up and running !!',
                });
            });
    });
});