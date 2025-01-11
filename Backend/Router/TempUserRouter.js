import express from "express";
import { verifyTempUser,createTemspUser } from "../Controller/TempUserController.js";

const router = express.Router();

router.post("/verify",verifyTempUser); // router to verify temp user
router.post("/create",createTemspUser); // router to create temp user

export default router;