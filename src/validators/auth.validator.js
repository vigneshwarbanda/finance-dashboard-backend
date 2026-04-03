const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["viewer", "analyst", "admin"]).optional(),
  status: z.enum(["active", "inactive"]).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

module.exports = {
  registerSchema,
  loginSchema
};