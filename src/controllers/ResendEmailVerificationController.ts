/**
 * Created by adithya.sathu on 26/11/2018.
 */
import { IResendEmailVerificationController } from "../types";
import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { log, registrationClient } from "../index";

export class ResendEmailVerificationController implements IResendEmailVerificationController {

    public resendEmail(req: Request, res: Response) {
        // validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        registrationClient.resendVerificationEmail(req.body.email, (err, userFound) => {
            if (err) {
                log.error('Sending verification email FAILED', err);
                return res.status(500).send({
                    errorMessage: err.message,
                });
            }
            if (userFound) {
                res.json({
                    message: 'An email has been sent to you, yet again. Please check it to verify your account.',
                });
            } else {
                return res.status(500).send({
                    errorMessage: 'user not found for email-id provided',
                });
            }
        });
    }
}
