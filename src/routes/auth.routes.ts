import { Router } from "express";
import { validateRequest } from "../middleware/validator.middleware";
import { login, logout, register } from "../controllers/auth.controller";
import { loginValidationSchema } from "../validators/auth.validator";
import { authenticate } from "../middleware/authenticate.middleware";

const router = Router();

router.post("/login", validateRequest(loginValidationSchema), login);
router.post("/register", validateRequest(loginValidationSchema), register);
router.get("/logout", authenticate, logout);

const authRoutes = router;
export default authRoutes;
