const express = require("express");
const router = express.Router();
const passport = require("passport");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware/isLogin.js");
const { isLoggedIn, isOwner } = require("../middleware/isLogin.js");
const wrapAsync = require("../utils/wrapAsync.js");

// My Bookings - GET /mybookings
router.get("/mybookings", isLoggedIn, wrapAsync(async (req, res) => {
  const Booking = require("../models/booking.js");
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("user/mybookings", { bookings });
}));

// Combined auth page route
router.get("/", (req, res) => {
  res.redirect("/listings");
});

// Auth page that contains both login and signup
// NOTE: flash messages (error, success, notRegistered) are already set in
// res.locals by the global middleware in app.js — do NOT call req.flash() again
// here or it will consume and empty them before EJS can read them.
router.get("/auth", (req, res) => {
  res.render("user/auth.ejs");
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

// Login route — Supports Email OR Username login
router.post("/login", saveRedirectUrl, async (req, res, next) => {
  const { username, password } = req.body;
  console.log("--- LOGIN ATTEMPT START ---");
  console.log("Input provided:", username); // could be email or username

  try {
    // 1. Manually find user by username OR email first
    // This allows us to support both and accurately detect "User Not Found"
    const userRecord = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!userRecord) {
      console.log("LOUD LOG: Result -> USER NOT FOUND (checked both username & email)");
      req.flash(
        "notRegistered",
        "No account found with that email/username. Please sign up!"
      );
      return req.session.save(() => {
        res.redirect("/auth?form=signup&reason=notfound");
      });
    }

    // 2. User exists, now authenticate using their official username
    console.log("LOUD LOG: User found in DB. Official username:", userRecord.username);
    
    // We pass the official username to passport.authenticate
    // This is because passport-local-mongoose uses the username field for authentication
    req.body.username = userRecord.username; 

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("LOUD ERROR: Passport internal error:", err);
        return next(err);
      }

      if (!user) {
        console.log("LOUD LOG: Result -> WRONG PASSWORD.");
        console.log("Passport Info:", info);
        req.flash("error", "Incorrect password. Please try again.");
        return req.session.save(() => {
          res.redirect("/auth");
        });
      }

      console.log("LOUD LOG: Authentication Success! User:", user.username);
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("LOUD ERROR: req.login failed:", loginErr);
          return next(loginErr);
        }
        req.flash("success", `Welcome back, ${user.username}! 🎉`);
        const redirectUrl = res.locals.redirectUrl || "/listings";
        return req.session.save(() => {
          res.redirect(redirectUrl);
        });
      });
    })(req, res, next);

  } catch (err) {
    console.error("LOUD ERROR: Login logic error:", err);
    return next(err);
  }
});

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
      query.country = { $regex: country, $options: "i" };
    }

    // Find listings that match the query
    const AllListing = await Listing.find(query).populate("owner");

    // Render the listings page with filtered results
    res.render("listing/index", {
      AllListing,
      currentUser: req.user, // Assuming you're using passport or similar auth
    });
  } catch (err) {
    console.error("Search error:", err);
    req.flash("error", "Error performing search");
    res.redirect("/listings");
  }
});

// Advanced search GET route
router.get("/advanced-search", async (req, res) => {
  try {
    const { searchText, country } = req.query;

    let query = {};
    if (searchText && searchText.trim() !== "") {
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
        { location: { $regex: searchText, $options: "i" } },
      ];
    }
    if (country && country !== "All Countries") {
      query.country = { $regex: country, $options: "i" };
    }

    // Fetch matching listings AND all distinct countries for the dropdown
    const [AllListing, countries] = await Promise.all([
      Listing.find(query).populate("owner"),
      Listing.distinct("country"),
    ]);

    res.render("listing/index", {
      AllListing,
      countries: countries.filter(Boolean).sort(),
      searchText: searchText || "",
      selectedCountry: country || "All Countries",
    });
  } catch (err) {
    console.error("LOUD Search Error:", err);
    req.flash("error", "Error performing search");
    res.redirect("/listings");
  }
});

module.exports = router;
