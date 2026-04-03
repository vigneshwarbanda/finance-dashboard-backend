const FinancialRecord = require("../models/FinancialRecord");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const buildDateFilter = (startDate, endDate) => {
  const match = {};

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  return match;
};

// GET /api/v1/dashboard/summary
const getSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const matchStage = buildDateFilter(startDate, endDate);

  const result = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const item of result) {
    if (item._id === "income") totalIncome = item.total;
    if (item._id === "expense") totalExpenses = item.total;
  }

  const netBalance = totalIncome - totalExpenses;

  res.status(200).json(
    new ApiResponse(200, "Dashboard summary fetched successfully", {
      totalIncome,
      totalExpenses,
      netBalance
    })
  );
});

// GET /api/v1/dashboard/category-breakdown
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const { startDate, endDate, type } = req.query;
  const matchStage = buildDateFilter(startDate, endDate);

  if (type) {
    matchStage.type = type;
  }

  const breakdown = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          category: "$category",
          type: "$type"
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        totalAmount: 1,
        count: 1
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  res.status(200).json(
    new ApiResponse(200, "Category breakdown fetched successfully", breakdown)
  );
});

// GET /api/v1/dashboard/trends?period=monthly
const getTrends = asyncHandler(async (req, res) => {
  const { startDate, endDate, period = "monthly" } = req.query;
  const matchStage = buildDateFilter(startDate, endDate);

  let dateFormat;

  if (period === "weekly") {
    dateFormat = "%Y-%U";
  } else if (period === "daily") {
    dateFormat = "%Y-%m-%d";
  } else {
    dateFormat = "%Y-%m";
  }

  const trends = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          period: {
            $dateToString: {
              format: dateFormat,
              date: "$date"
            }
          },
          type: "$type"
        },
        totalAmount: { $sum: "$amount" }
      }
    },
    {
      $group: {
        _id: "$_id.period",
        income: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        period: "$_id",
        income: 1,
        expense: 1,
        netBalance: { $subtract: ["$income", "$expense"] }
      }
    },
    { $sort: { period: 1 } }
  ]);

  res.status(200).json(
    new ApiResponse(200, "Trend data fetched successfully", {
      period,
      trends
    })
  );
});

// GET /api/v1/dashboard/recent-activity
const getRecentActivity = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const recentRecords = await FinancialRecord.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.status(200).json(
    new ApiResponse(200, "Recent activity fetched successfully", recentRecords)
  );
});

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getTrends,
  getRecentActivity
};