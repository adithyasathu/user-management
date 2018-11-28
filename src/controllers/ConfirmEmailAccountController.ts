/**
 * Created by adithya.sathu on 28/11/2018.
 */
import { IConfirmEmailAccountController } from "../types";
import { Request, Response} from "express";
import { registrationClient, log } from "../index";
import {validationResult} from "express-validator/check";

export class ConfirmEmailAccountController implements IConfirmEmailAccountController {

    public confirmEmail(req: Request, res: Response) {
        const id = req.params.id;
        // validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        registrationClient.confirmTempUser(id, (err, user) => {
            if (err) {
                log.error('Confirming temp user FAILED', err);
                return res.status(500).send({
                    errorMessage: err.message,
                });
            }
            if (user) {
                res.json({
                    message: 'Successfully confirmed the User Email Account',
                });
            } else {
                log.error('Invalid/Expired Verification Id', id);
                return res.status(400).send({
                    errorMessage: "Invalid/Expired Verification Id",
                });
            }
        });

    }
}
