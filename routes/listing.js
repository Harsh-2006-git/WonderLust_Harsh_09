const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const ListingController = require("../controllers/listings.js");
const { isLoggedIn, isOwner } = require("../middleware/isLogin.js"); // Assuming you have this middleware
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Index - GET /listings
router.get("/", wrapAsync(ListingController.index));

// New listing form - GET /listings/new
router.get("/new", isLoggedIn, wrapAsync(ListingController.renderNewForm));

// Create listing - POST /listings
// Create listing with file upload - POST /listings
router.post("/", isLoggedIn, wrapAsync(ListingController.createListing));

// Show listing - GET /listings/:id
router.get("/:id", wrapAsync(ListingController.showListing));

// Edit form - GET /listings/:id/edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

// Like listing - GET /listings/:id/like
router.get("/:id/like", isLoggedIn, wrapAsync(ListingController.likedListing));

// Update listing - PUT /listings/:id
router.put("/:id", isLoggedIn, wrapAsync(ListingController.updateListing));

// Delete listing - DELETE /listings/:id
router.delete("/:id", isLoggedIn, wrapAsync(ListingController.deleteListing));

module.exports = router;
