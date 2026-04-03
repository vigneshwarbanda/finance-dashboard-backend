const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// GET all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, "Users fetched successfully", users)
  );
});

// GET single user
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, "User fetched successfully", user)
  );
});

// UPDATE user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const targetUserId = req.params.id;

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (req.user._id.toString() === targetUserId && role !== "admin") {
    throw new ApiError(400, "Admin cannot change their own role to a lower role");
  }

  user.role = role;
  await user.save();

  const safeUser = await User.findById(user._id).select("-password");

  res.status(200).json(
    new ApiResponse(200, "User role updated successfully", safeUser)
  );
});

// UPDATE user status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const targetUserId = req.params.id;

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (req.user._id.toString() === targetUserId && status === "inactive") {
    throw new ApiError(400, "Admin cannot deactivate their own account");
  }

  user.status = status;
  await user.save();

  const safeUser = await User.findById(user._id).select("-password");

  res.status(200).json(
    new ApiResponse(200, "User status updated successfully", safeUser)
  );
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus
};