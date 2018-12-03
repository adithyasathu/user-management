import { RegistrationController } from "./RegistrationController";
import { ResendEmailVerificationController } from "./ResendEmailVerificationController";
import { ConfirmEmailAccountController } from "./ConfirmEmailAccountController";
import { LoginController } from "./LoginController";
import { VerifyTokenController } from "./VerifyTokenController";

export const controllers = {
    registration : new RegistrationController(),
    resendEmail: new ResendEmailVerificationController(),
    confirmEmail: new ConfirmEmailAccountController(),
    login: new LoginController(),
    verifyToken : new VerifyTokenController(),
} ;
