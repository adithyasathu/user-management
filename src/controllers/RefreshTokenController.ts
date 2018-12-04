/**
 * Created by adithya.sathu on 04/12/2018.
 */
import {IRefreshTokenController} from "../types";
import { Request, Response } from "express";
import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import { log } from "../index";
const expiresIn = config.get("login.tokenExpiry");
import { validationResult } from "express-validator/check";

export class RefreshTokenController implements IRefreshTokenController {

    public refreshToken(req: Request, res: Response) {
        const auth = req.get("Authorization");

        // validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const token = auth.replace("Bearer", "").trim();
        jwt.verify(token, config.get("login.secretKey"), async (err, decoded) => {
            if (err) {
                log.error('Error verifying user token:', err.message);
                return res.status(401).send({
                    errorMessage : err.message,
                });
            }

            const refreshedToken = await jwt.sign(
                { email: decoded.email , timestamp: Date.now() },
                config.get("login.secretKey"),
                { expiresIn: Number(expiresIn) });

            return res.send({ token: refreshedToken, email: decoded.email, expiresInSec: Number(expiresIn) });

        });
    };

}
