import { Router } from "express";
import { createUrlHandler, redirectHandler, statsHandler } from "../controllers/url.controller";

const router = Router();

router.post("/api/urls", createUrlHandler);
router.get("/api/urls/:shortCode/stats", statsHandler);
router.get("/:shortCode", redirectHandler);

export default router;
