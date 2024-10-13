import express from "express";
import { checkValidationErrors } from "../utils/validation";
import {
  addUserValidator,
  loginUserValidator,
  sendVerificationCodeValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from "../validators/user.validator";
import {
  addUser,
  loginUser,
  logout,
  refreshToken,
  resetPassword,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", addUserValidator, checkValidationErrors, addUser);
authRouter.post("/login", loginUserValidator, checkValidationErrors, loginUser);
authRouter.post(
  "/send-verification-code",
  sendVerificationCodeValidator,
  checkValidationErrors,
  sendVerificationCode
);
authRouter.patch(
  "/reset-password",
  resetPasswordValidator,
  checkValidationErrors,
  resetPassword
);
authRouter.patch(
  "/verify-email",
  verifyEmailValidator,
  checkValidationErrors,
  verifyEmail,
);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
