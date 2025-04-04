import express, { type Router } from "express";
import { ServerResponse } from "node:http";

const router: Router = express.Router();

router.post("/sanctum", (req, res: ServerResponse) => {});

export default router;
