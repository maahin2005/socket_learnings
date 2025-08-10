import { Router } from "express";
import { validateRequest } from "../middleware/validator.middleware";
import { login, register } from "../controllers/auth.controller";
import { loginValidationSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", validateRequest(loginValidationSchema), login);
router.post("/register", validateRequest(loginValidationSchema), register);

const authRoutes = router;
export default authRoutes;
