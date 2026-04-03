const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getSummary,
  getCategoryBreakdown,
  getTrends,
  getRecentActivity
} = require("../controllers/dashboard.controller");

router.use(authenticate);

router.get("/summary", authorize("viewer", "analyst", "admin"), getSummary);
router.get("/category-breakdown", authorize("viewer", "analyst", "admin"), getCategoryBreakdown);
router.get("/trends", authorize("viewer", "analyst", "admin"), getTrends);
router.get("/recent-activity", authorize("viewer", "analyst", "admin"), getRecentActivity);

module.exports = router;