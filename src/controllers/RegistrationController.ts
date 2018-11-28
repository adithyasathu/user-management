/**
 * Created by adithya.sathu on 08/11/2018.
 */
import { IRegistrationController } from "../types";
import { Request, Response} from "express";
import { User} from "../models/user";
import { registrationClient, log } from "../index";
import { validationResult } from "express-validator/check";

export class RegistrationController implements IRegistrationController {

    public registerUser(req: Request, res: Response) {
       // validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newUser = new User(req.body);
        registrationClient.createTempUser(newUser, (err, existingPersistentUser, newTempUser) => {
            if (err) {
                log.error("Error creating temp user ", err);
                return res.status(500).send({ errorMessage: err.message });
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                return res.status(500).send({
                    errorMessage : 'You have already signed up and confirmed your account',
                });
            }

            // new user created
            if (newTempUser) {
                const URL = newTempUser[registrationClient.options.URLFieldName];

                registrationClient.sendVerificationEmail(req.body.email, URL, (error, info) => {
                    if (error) {
                        log.error('Sending verification email FAILED', error);
                        return res.status(500).send({
                            errorMessage: error.message,
                        });
                    }
                    res.json({
                        message: 'An email has been sent to you. Please check it to verify your account',
                    });

                });
                // user already exists in temporary collection!
            } else {
                return res.status(500).send({
                    errorMessage : 'You have already signed up. Please check your email to verify your account',
                });
            }
        });

    };

}
