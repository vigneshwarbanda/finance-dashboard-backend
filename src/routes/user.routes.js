const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/objectId.middleware");

const {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus
} = require("../controllers/user.controller");

const {
  updateUserRoleSchema,
  updateUserStatusSchema
} = require("../validators/user.validator");

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", getUsers);
router.get("/:id", validateObjectId(), getUserById);
router.patch("/:id/role", validateObjectId(), validate(updateUserRoleSchema), updateUserRole);
router.patch("/:id/status", validateObjectId(), validate(updateUserStatusSchema), updateUserStatus);

module.exports = router;