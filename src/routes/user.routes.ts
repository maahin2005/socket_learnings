import { Router } from "express";

const router = Router();

import {
  myData,
  conversationWith,
  conversationPeers,
  chatHistory,
} from "../controllers/user.controller";

router.get("/me", myData);
router.get("/chats", chatHistory);
router.get("/conversations", conversationPeers);
router.get("/conversations/:peerId", conversationWith);

const userRoutes = router;
export default userRoutes;
