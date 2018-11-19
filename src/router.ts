/**
 * Created by adithya.sathu on 08/11/2018.
 */
import {Request, Response, Router} from "express";
import {IRoutes} from "./types";
import * as mongoose from 'mongoose';
import { controllers } from "./controllers";
import {signUpValidationRules} from "./validators";

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

        return router;
    }

}
