const { z } = require("zod");

const createRecordSchema = z.object({
  amount: z.number({
    required_error: "Amount is required"
  }).positive("Amount must be greater than 0"),

  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be either income or expense" })
  }),

  category: z.string({
    required_error: "Category is required"
  }).min(1, "Category is required").max(50, "Category is too long"),

  date: z.string({
    required_error: "Date is required"
  }).min(1, "Date is required"),

  note: z.string().max(200, "Note is too long").optional()
});

const updateRecordSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0").optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().min(1, "Category is required").max(50).optional(),
  date: z.string().optional(),
  note: z.string().max(200, "Note is too long").optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required for update" }
);

module.exports = {
  createRecordSchema,
  updateRecordSchema
};