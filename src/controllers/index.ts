import { RegistrationController } from "./RegistrationController";
import { ResendEmailVerificationController } from "./ResendEmailVerificationController";
import { ConfirmEmailAccountController } from "./ConfirmEmailAccountController";
import { LoginController } from "./LoginController";

export const controllers = {
    registration : new RegistrationController(),
    resendEmail: new ResendEmailVerificationController(),
    confirmEmail: new ConfirmEmailAccountController(),
    login: new LoginController(),
} ;
