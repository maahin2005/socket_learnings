import { Router } from "express";

const router = Router();

import { myData } from "../controllers/user.controller";

router.get("/me", myData);

const userRoutes = router;
export default userRoutes;
