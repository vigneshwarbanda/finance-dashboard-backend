const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "viewer",
    status: status || "active"
  });

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };

  res.status(201).json(new ApiResponse(201, "User registered successfully", safeUser));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User account is inactive");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user._id);

  res.status(200).json(new ApiResponse(200, "Login successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  }));
});

const profile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Profile fetched successfully", req.user));
});

module.exports = {
  register,
  login,
  profile
};