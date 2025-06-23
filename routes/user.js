const express = require("express");
const router = express.Router();
const passport = require("passport");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware/isLogin.js");
const { isLoggedIn, isOwner } = require("../middleware/isLogin.js");

// Combined auth page route
router.get("/", (req, res) => {
  res.redirect("/listings");
});

// Auth page that contains both login and signup
router.get("/auth", (req, res) => {
  res.render("user/auth.ejs", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

// Keep existing signup route for form submission
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Log the user in after registration
    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", "Something went wrong during login.");
        return res.redirect("/auth?form=signup"); // Redirect back to auth page with signup form active
      }
      req.flash(
        "success",
        "Welcome to Wonderlust! You are registered successfully."
      );
      res.redirect("/listings");
    });
  } catch (err) {
    console.error("Error during registration:", err);
    // Flash message for registration error
    req.flash(
      "error",
      "The account already exists or there was a problem with registration."
    );
    res.redirect("/auth?form=signup"); // Redirect back to auth page with signup form active
  }
});

// Keep existing login routes but update redirects
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/auth",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect(res.locals.redirectUrl); // Change to res.locals (with an 's')
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out successfully");
    res.redirect("/listings");
  });
});

// Add this to your routes file (e.g., routes/listings.js)

// Advanced search route
router.post("/advanced-search", async (req, res) => {
  try {
    const { searchText, country } = req.body;
    let query = {};

    // Build search query
    if (searchText && searchText.trim() !== "") {
      // Create OR conditions for title, description, and location
      query = {
        $or: [
          { title: { $regex: searchText, $options: "i" } },
          { description: { $regex: searchText, $options: "i" } },
          { location: { $regex: searchText, $options: "i" } },
        ],
      };
    }

    // Add country filter if specified
    if (country && country !== "All Countries") {
      query.country = country;
    }

    // Find listings that match the query
    const AllListing = await Listing.find(query).populate("owner");

    // Render the listings page with filtered results
    res.render("listings/index", {
      AllListing,
      currentUser: req.user, // Assuming you're using passport or similar auth
    });
  } catch (err) {
    console.error("Search error:", err);
    req.flash("error", "Error performing search");
    res.redirect("/listings");
  }
});

// You might also want to add a GET route for the same functionality
router.get("/advanced-search", async (req, res) => {
  try {
    const { searchText, country } = req.query;
    let query = {};

    // Build search query
    if (searchText && searchText.trim() !== "") {
      query = {
        $or: [
          { title: { $regex: searchText, $options: "i" } },
          { description: { $regex: searchText, $options: "i" } },
          { location: { $regex: searchText, $options: "i" } },
        ],
      };
    }

    // Add country filter if specified
    if (country && country !== "All Countries") {
      query.country = country;
    }

    // Find listings that match the query
    const AllListing = await Listing.find(query).populate("owner");

    // Render the listings page with filtered results
    res.render("listing/index", {
      AllListing,
      currentUser: req.user,
    });
  } catch (err) {
    console.error("Search error:", err);
    req.flash("error", "Error performing search");
    res.redirect("/listings");
  }
});

module.exports = router;
