/**
 * Created by adithya.sathu on 08/11/2018.
 */
import { IServer } from "./types";
import * as express from "express";
import * as mongoose from 'mongoose';
import * as config from "config";
import * as parser from "body-parser";
import {Routes} from "./router";
import {log} from "./index";

export class Server implements IServer {

    private app: express.Application = express();
    private serverStarted: boolean = false;
    private server = null;

    public async start() {
        log.info("Starting server");

        this.app.use(parser.json());

        // to support URL-encoded bodies
        this.app.use(parser.urlencoded({
            extended: true,
        }));

        this.app.use('/api/v1', new Routes().routes());
        // Start the app by listening on the default
        // Heroku port
        return this.server = this.app.listen(process.env.PORT || config.get("service.api.port"),
            () => this.serverStarted = true);

    }

    public async stop() {
        if (this.serverStarted) {
            log.info("Stopping server");
            await mongoose.connection.close();
            await this.server.close();
        }

    }
}
