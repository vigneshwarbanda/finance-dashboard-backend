const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/objectId.middleware");

const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require("../controllers/record.controller");

const {
  createRecordSchema,
  updateRecordSchema
} = require("../validators/record.validator");

router.use(authenticate);

// Read access: analyst and admin only
router.get("/", authorize("analyst", "admin"), getRecords);
router.get("/:id", validateObjectId(), authorize("analyst", "admin"), getRecordById);

// Write access: admin only
router.post("/", authorize("admin"), validate(createRecordSchema), createRecord);
router.patch("/:id", validateObjectId(), authorize("admin"), validate(updateRecordSchema), updateRecord);
router.delete("/:id", validateObjectId(), authorize("admin"), deleteRecord);

module.exports = router;