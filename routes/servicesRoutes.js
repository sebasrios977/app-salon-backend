import express from "express";
import { services } from "../data/beatyServices.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.json(services);
});

export default router;
