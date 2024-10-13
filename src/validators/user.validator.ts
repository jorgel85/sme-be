import { body } from "express-validator";

const addUserValidator = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Username is required"),

  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),

  body("phoneNumber")
    .not()
    .isEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please enter valid phone number."),

  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const loginUserValidator = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),

  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const sendVerificationCodeValidator = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
];

const resetPasswordValidator = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),

  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("verificationCode")
    .not()
    .isEmpty()
    .withMessage("VerificationCode is required"),
];

const verifyEmailValidator = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),

  body("verificationCode")
    .not()
    .isEmpty()
    .withMessage("VerificationCode is required"),
];

export {
  addUserValidator,
  loginUserValidator,
  sendVerificationCodeValidator,
  resetPasswordValidator,
  verifyEmailValidator,
};
