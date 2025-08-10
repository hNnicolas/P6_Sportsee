const express = require("express");
const jwt = require("jsonwebtoken");

const users = require("./data.json");

const SECRET_KEY = "your-secret-key-12345"; // In a real app, this would be in environment variables

const getUserById = (userId) => {
  return users.find((user) => user.id === userId);
};

const router = express.Router();

const { authenticateToken, generateToken } = require("./middleware");

/**
 * POST /api/login ✅
 * Returns a token for the user
 */
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  return res.json({
    token,
    userId: user.id,
  });
});

/** ✅
 * GET /api/user-info
 * Returns user information including profile, goals, and statistics
 */
router.get("/api/user-info", authenticateToken, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_KEY);
  const user = getUserById(decodedToken.userId);
  const runningData = user.runningData;

  // Calculate overall statistics
  const totalDistance = runningData.reduce(
    (sum, session) => sum + session.distance,
    0
  ).toFixed(1);
  const totalSessions = runningData.length;
  const totalDuration = runningData.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Extract user profile information
  const userProfile = {
    firstName: user.userInfos.firstName,
    lastName: user.userInfos.lastName,
    createdAt: user.userInfos.createdAt,
    age: user.userInfos.age,
    weight: user.userInfos.weight,
    height: user.userInfos.height,
    profilePicture: user.userInfos.profilePicture,
  };

  return res.json({
    profile: userProfile,
    statistics: {
      totalDistance,
      totalSessions,
      totalDuration,
    },
  });
});

/**
 * GET /api/user-activity
 * Returns running sessions between startWeek and endWeek
 */
router.get("/api/user-activity", authenticateToken, (req, res) => {
  const { startWeek, endWeek } = req.query;
  
  if (!startWeek || !endWeek) {
    return res.status(400).json({ message: "startWeek and endWeek are required" });
  }

  const user = getUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const runningData = user.runningData;

  // Convert week strings to Date objects
  const startDate = new Date(startWeek);
  const endDate = new Date(endWeek);
  const now = new Date();
  
  // Filter sessions between startWeek and endWeek, excluding future dates
  const filteredSessions = runningData.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate && sessionDate <= now;
  });

  // Sort by date ascending
  const sortedSessions = filteredSessions.sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return res.json(sortedSessions);
});

module.exports = router;
