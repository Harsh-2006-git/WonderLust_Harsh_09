if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // Add this import
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Adjust path as needed
const LiveURL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/Wonderlust";

// Import models
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

// Import routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/reviews");
const UserRoutes = require("./routes/user");
const likedListingsRoutes = require("./routes/likedListings");

// Session configuration
// Session configuration
const store = MongoStore.create({
  mongoUrl: LiveURL,
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("Session Store Error:", err);
});
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || "your-secret-key", // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Middleware
app.use(session(sessionOptions)); // Add session middleware
app.use(flash()); // Add flash middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // For serving static files
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages and current user available to all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.notRegistered = req.flash("notRegistered");
  res.locals.currentUser = req.user;
  next();
});

// Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database Connection

// Database Connection
// Database Connection
async function main() {
  try {
    await mongoose.connect(LiveURL);
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}
main();

// Mount routes
app.use("/listings", listingRoutes);
app.use("/listings", reviewRoutes);
app.use("/", UserRoutes);
app.use("/user", likedListingsRoutes);

// 404 handler - now after all other routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).send("Something broke! Check the console for details.");
});

// Server Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
