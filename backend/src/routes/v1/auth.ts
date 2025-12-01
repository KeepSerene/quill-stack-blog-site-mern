/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import handleRegister from "@/controllers/v1/auth/register";

const router = Router();

router.post("/register", handleRegister);

export default router;
