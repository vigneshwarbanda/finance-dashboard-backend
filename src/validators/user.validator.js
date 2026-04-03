const { z } = require("zod");

const updateUserRoleSchema = z.object({
  role: z.enum(["viewer", "analyst", "admin"], {
    errorMap: () => ({ message: "Role must be viewer, analyst, or admin" })
  })
});

const updateUserStatusSchema = z.object({
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be active or inactive" })
  })
});

module.exports = {
  updateUserRoleSchema,
  updateUserStatusSchema
};