import { RegistrationController } from "./RegistrationController";
import { ResendEmailVerificationController } from "./ResendEmailVerificationController";

export const controllers = {
    registration : new RegistrationController(),
    resendEmail: new ResendEmailVerificationController(),
} ;
