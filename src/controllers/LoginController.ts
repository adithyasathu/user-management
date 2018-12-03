/**
 * Created by adithya.sathu on 03/12/2018.
 */
import {ILoginController} from "../types";
import { Request, Response} from "express";
import * as config from 'config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from "../models/user";
import { log } from "../index";
import {validationResult} from "express-validator/check";

export class LoginController implements ILoginController {

    public loginUser(req: Request, res: Response) {
        const email = req.body.email;
        const password = req.body.password;

        // validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        User.findOne({ email }, async (err, user) => {
            if (err) {
                log.error('Error finding user:', err);
                return res.status(500).send({
                    errorMessage : err.message,
                });
            } else if (user) {
                if ( bcrypt.compareSync(password, user.password)) {
                    const expiresIn = config.get("login.tokenExpiry");
                    const token = await jwt.sign({ email: user.email, timestamp: Date.now() },
                                                config.get("login.secretKey"),
                                                { expiresIn: Number(expiresIn) });
                    return res.send({ token, email, expiresInSec: Number(expiresIn) });

                } else {
                    log.error('Error invalid user credentials:');
                    return res.status(401).send({
                        errorMessage : 'invalid credentials',
                    });
                }

            } else {
                log.error('no user with email id provided');
                return res.status(401).send({
                    errorMessage : 'no user with email id provided',
                });
            }
        }).lean();
    };

}
