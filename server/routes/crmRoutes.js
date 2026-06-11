import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createDeal,
  createLead,
  listDeals,
  listLeads,
} from "../services/crmService.js";

const router = Router();

router.use(requireAuth);

function requireDatabase(req, res) {
  if (!req.app.locals.dbReady) {
    res.status(503).json({ message: "Database connection is unavailable." });
    return false;
  }

  return true;
}

router.get("/leads", async (req, res) => {
  try {
    if (!requireDatabase(req, res)) {
      return;
    }

    res.json(await listLeads());
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/leads", async (req, res) => {
  try {
    if (!requireDatabase(req, res)) {
      return;
    }

    res.status(201).json(await createLead(req.body));
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/deals", async (req, res) => {
  try {
    if (!requireDatabase(req, res)) {
      return;
    }

    res.json(await listDeals());
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/deals", async (req, res) => {
  try {
    if (!requireDatabase(req, res)) {
      return;
    }

    res.status(201).json(await createDeal(req.body));
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
