import { check } from 'express-validator/check';

export const signUpValidationRules = [
    check('firstName').isString().withMessage('firstName is required'),
    check('lastName').isString().withMessage('lastName is required'),
    check('email').isEmail().withMessage('No/Invalid Email is provided'),
    check('password').isLength({ min: 6 }).withMessage('Minimum 6 characters required'),
];

export const resendEmailValidationRules = [
    check('email').isEmail().withMessage('No/Invalid Email is provided'),
];
