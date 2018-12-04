/**
 * Created by adithya.sathu on 08/11/2018.
 */
import {Request, Response, Router} from "express";
import {IRoutes} from "./types";
import * as mongoose from 'mongoose';
import * as swaggerUI from "swagger-ui-express";
import { controllers } from "./controllers";
import contract from "./contract";
import {
    confirmEmailValidationRules,
    loginValidationRules,
    resendEmailValidationRules,
    signUpValidationRules,
    tokenValidationRules,
} from "./validators";

export class Routes implements IRoutes {

    public routes(): Router {

        const router = Router();

        // MOST IMPORTANT: Service health check : should confirm the dependencies are healthy
        router.get("/health", (req: Request, res: Response) => {
               if (mongoose.connection.readyState === 1) {

                   return res.status(200).send({
                       message: 'Server is up and running !!',
                   });
               }

               return res.status(500).send({
                errorMessage: "MongoDB isn't connected",
               });

        });

        router.post("/sign-up", signUpValidationRules, controllers.registration.registerUser);

        router.post("/resend-email", resendEmailValidationRules, controllers.resendEmail.resendEmail);

        router.get("/email-verification/:id", confirmEmailValidationRules, controllers.confirmEmail.confirmEmail);

        router.post("/login", loginValidationRules, controllers.login.loginUser);

        router.get("/validate-token", tokenValidationRules, controllers.verifyToken.validateToken);

        router.get("/refresh-token", tokenValidationRules, controllers.refreshToken.refreshToken);

        router.use('/docs', swaggerUI.serve, swaggerUI.setup(contract));

        // global express handler
        router.use((err, req, res, next) => {
            if (res.headersSent) {
                return next(err);
            } else {
                res.status(500).json(err.message || err);
            }

        });

        return router;
    }

}
