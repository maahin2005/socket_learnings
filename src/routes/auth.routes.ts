import { Router } from "express";
import { validateRequest } from "../middleware/validator.middleware";
import { login } from "../controllers/auth.controller";
import { loginValidationSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", validateRequest(loginValidationSchema), login);

const authRoutes = router;
export default authRoutes;
