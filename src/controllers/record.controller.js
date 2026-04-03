const FinancialRecord = require("../models/FinancialRecord");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// CREATE record
const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, note } = req.body;

  const record = await FinancialRecord.create({
    amount,
    type,
    category,
    date: new Date(date),
    note: note || "",
    createdBy: req.user._id
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Record created successfully", record));
});

// GET all records with filters + pagination
const getRecords = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc"
  } = req.query;

  const query = {};

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const sortOrder = order === "asc" ? 1 : -1;

  const [records, total] = await Promise.all([
    FinancialRecord.find(query)
      .populate("createdBy", "name email role")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNumber),
    FinancialRecord.countDocuments(query)
  ]);

  res.status(200).json(
    new ApiResponse(200, "Records fetched successfully", {
      records,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    })
  );
});

// GET single record by ID
const getRecordById = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Record fetched successfully", record));
});

// UPDATE record
const updateRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  const allowedFields = ["amount", "type", "category", "date", "note"];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      record[field] = field === "date" ? new Date(req.body[field]) : req.body[field];
    }
  }

  await record.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Record updated successfully", record));
});

// DELETE record
const deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  await record.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, "Record deleted successfully", null));
});

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};