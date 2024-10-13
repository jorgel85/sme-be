//---------------------------
// Project: S.Me API
// Author : J.L S.Me Team
//---------------------------

import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import express, { Response } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";

// Routes
import authRouter from "./src/routes/auth.routes";
import searchRouter from "./src/routes/search.routes";

config();
const prisma = new PrismaClient();
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan("dev"));

app.get("/health-checker", async (_, res: Response) => {
  const message = "Welcome to S.Me API";
  res.status(200).json({
    status: "Success",
    message,
  });
});

app.use("/auth", authRouter);
app.use("/search", searchRouter);

const PORT = process.env.PORT || 8000;

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    console.log("Disconnected from database!");
    process.exit(0);
  } catch (error) {
    console.log("Error disconnecting from database due to: ", error);
    process.exit(1);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
