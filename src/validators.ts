import { check, param, header } from 'express-validator/check';

export const signUpValidationRules = [
    check('firstName').isString().withMessage('firstName is required'),
    check('lastName').isString().withMessage('lastName is required'),
    check('email').isEmail().withMessage('Invalid Email is provided'),
    check('password').isLength({ min: 6 }).withMessage('Password must contain at least six characters'),
];

export const resendEmailValidationRules = [
    check('email').isEmail().withMessage('Invalid Email is provided'),
];

export const confirmEmailValidationRules = [
    param('id').isLength({ min: 20 , max: 20}).withMessage('Invalid verification ID provided'),
];

export const loginValidationRules = [
    check('email').isEmail().withMessage('Invalid Email is provided'),
    check('password').isString().withMessage('Password is required'),
];

export const tokenValidationRules = [
    header('Authorization').matches(/(Bearer)\s/i).withMessage('Valid Authorization Token is required'),
];
