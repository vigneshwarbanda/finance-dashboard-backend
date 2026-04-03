const { z } = require("zod");

const trendsQuerySchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

module.exports = {
  trendsQuerySchema
};