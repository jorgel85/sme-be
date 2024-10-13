import express from "express";
import { search } from "../controllers/search.controller";

const searchRouter = express.Router();

searchRouter.get("/", search);

export default searchRouter;
