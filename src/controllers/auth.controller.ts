import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUniqueUser,
  updateUser,
} from "../services/user.service";
import {
  createToken,
  deleteToken,
  findFirstToken,
} from "../services/token.service";
import { sendEmail } from "../utils/email";
import { createResetPasswordLink } from "../utils/utils";
import { resetPasswordEmail } from "../utils/emailTemplate";

const refreshTokenCookieOptions = {
  httpOnly: process.env.NODE_ENV === "production" ? true : false,
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Path: controller/auth.controller.ts
// Desc: Register a new user
// Route: POST /api/auth/register
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(
      10
    );
    const verificationCodeExp = (
      new Date().getTime() +
      10 * 60 * 1000
    ).toString(10);

    const newUser = await createUser({
      username,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      verificationCode,
      verificationCodeExp,
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
    };

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      res.status(500).json({ message: "Internal Server Error." });
      return;
    }

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    await createToken({
      accessToken,
      refreshToken,
      user: {
        connect: {
          id: newUser.id,
        },
      },
    });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.status(201).json({
      message: "A new user has been created successfully!",
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        verified: newUser.verified,
      },
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({
          message:
            "Email or Phone number already exists, please use another email address or phone number.",
        });
        return;
      }
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.ts
// Desc: Login a user
// Route: POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await findUniqueUser({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      res.status(500).json({ message: "Internal Server Error." });
      return;
    }

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    await createToken({
      accessToken,
      refreshToken,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      message: "User logged in successfully!",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.js
// Desc: Refresh access token
// Route: POST /api/auth/refresh-token
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh Token Not found." });
      return;
    }

    const existingToken = await findFirstToken({ refreshToken });
    if (!existingToken) {
      res.status(401).json({ message: "Refresh Token Invalid." });
      return;
    }

    const existUser = await findUniqueUser({ id: existingToken.userId });
    if (!existUser) {
      res
        .status(404)
        .json({ message: "No user associated with Refresh Token." });
      return;
    }

    const decodedToken = jwt.decode(refreshToken);
    if (
      !decodedToken ||
      typeof decodedToken !== "object" ||
      !("exp" in decodedToken) ||
      typeof decodedToken.exp !== "number"
    ) {
      res.status(401).json({ message: "Refresh token invalid." });
      return;
    }

    const refreshTokenExpiresAt = decodedToken.exp * 1000;
    if (Date.now() >= refreshTokenExpiresAt) {
      await deleteToken(refreshToken);
      res.status(401).json({ message: "Refresh token expired!" });
      return;
    }

    const payload = {
      id: existUser.id,
      email: existUser.email,
    };

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      res.status(500).json({ message: "Internal Server Error." });
      return;
    }

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "6h",
    });

    res.status(200).json({
      accessToken,
      user: {
        id: existUser.id,
        email: existUser.email,
        verified: existUser.verified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.js
// Desc: Logout a user
// Route: POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await deleteToken(refreshToken);
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.js
// Desc: Send a verification code to user's email address
// Route: POST /api/auth/send-verification-code
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await findUniqueUser({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ message: "Unregistered email address." });
      return;
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(
      10
    );
    const verificationCodeExp = (
      new Date().getTime() +
      120 * 60 * 1000
    ).toString(10);

    await updateUser(
      { email },
      {
        verificationCode,
        verificationCodeExp,
      }
    );

    // Send verificationCode to the given email address.
    // await sendEmail(email, 'Hi', '', 'Good morning?')
    //
    res
      .status(200)
      .json({ message: "Verification code has been sent successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.js
// Desc: Send a unique link to user's email address to reset password
// Route: POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await findUniqueUser({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ message: "Unregistered email address." });
      return;
    }

    const resetPasswordToken = crypto.randomBytes(50).toString("hex");
    const resetPasswordTokenExp = (
      new Date().getTime() +
      120 * 60 * 1000
    ).toString(10);

    await updateUser(
      { email },
      {
        resetPasswordToken,
        resetPasswordTokenExp,
      }
    );

    const resetPasswordLink = createResetPasswordLink(
      "https://www.synthesise.me",
      resetPasswordToken,
      email
    );
    await sendEmail(email, "Password reset", resetPasswordEmail(user.username, resetPasswordLink), "");

    res
      .status(200)
      .json({ message: "Reset password link has been sent successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.js
// Desc: Reset password
// Route: PATCH /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, resetPasswordToken } = req.body;

    const user = await findUniqueUser({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ message: "Unregistered email address." });
      return;
    }

    if (
      resetPasswordToken !== user.resetPasswordToken ||
      (user.resetPasswordTokenExp !== null &&
        parseInt(user.resetPasswordTokenExp, 10) < new Date().getTime())
    ) {
      res
        .status(400)
        .json({ message: "Invalid or expired reset password token." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await updateUser(
      { email },
      {
        password: hashedPassword,
        verified: true,
      }
    );

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Path: controller/auth.controller.js
// Desc: Verify email
// Route: PATCH /api/auth/verify-email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await findUniqueUser({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ message: "Unregistered email address." });
      return;
    }

    if (user.verified) {
      res.status(400).json({ message: "Email has already been verified." });
      return;
    }

    if (
      verificationCode !== user.verificationCode ||
      (user.verificationCodeExp !== null &&
        parseInt(user.verificationCodeExp, 10) < new Date().getTime())
    ) {
      res
        .status(400)
        .json({ message: "Invalid verification code or code has expired." });
      return;
    }

    await updateUser({ email }, { verified: true });

    res.status(200).json({ message: "Email has been verified successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
