/**
 * Created by adithya.sathu on 08/11/2018.
 */
import {Application, Request, Response} from "express";

export interface IServer {
    start();
    stop();
}

export interface IRoutes {
    routes(app: Application);
}

export interface IRegistrationController {
    registerUser(req: Request, res: Response);
}

export interface IResendEmailVerificationController {
    resendEmail(req: Request, res: Response);
}

export interface IConfirmEmailAccountController {
    confirmEmail(req: Request, res: Response);
}

export interface ILoginController {
    loginUser(req: Request, res: Response);
}
