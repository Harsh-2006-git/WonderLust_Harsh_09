const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isOwner } = require("../middleware/isLogin.js");

// Add a review
router.post("/:id/review", isLoggedIn, async (req, res) => {
  try {
    // Find the listing
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.redirect("/listings");
    }
    // Create new review
    const newReview = new Review(req.body.review);
    // Associate review with the listing
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    // Save both
    await Promise.all([listing.save(), newReview.save()]);
    // Redirect to the listing page to show the updated reviews
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error("Error adding review:", err);
    res.redirect(`/listings/${req.params.id}`);
  }
});

// Delete a review
router.post("/:id/reviews/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  res.redirect(`/listings/${id}`);
});

module.exports = router;
