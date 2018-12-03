/**
 * Created by adithya.sathu on 03/12/2018.
 */
import { IVerifyTokenController } from "../types";
import { Request, Response } from "express";
import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import { log } from "../index";
import { validationResult } from "express-validator/check";

export class VerifyTokenController implements IVerifyTokenController {

    public validateToken(req: Request, res: Response) {
        const auth = req.get("Authorization");

        // validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const token = auth.replace("Bearer", "").trim();
        jwt.verify(token, config.get("login.secretKey"), (err, data) => {
            if (err) {
                log.error('Error verifying user token:', err.message);
                return res.status(400).send({
                    errorMessage : err.message,
                });
            }
            // tslint:disable:no-unused-variable
            const {timestamp, ...decoded} = data;
            return res.send(decoded);
        });
    };

}
