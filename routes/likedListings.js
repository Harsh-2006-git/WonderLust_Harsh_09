// Add this to your routes file (e.g., routes/listings.js or a new file like routes/user.js)
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware/isLogin"); // Assuming you have middleware for authentication

// Route to show liked listings for the current user
router.get("/liked-listings", isLoggedIn, async (req, res) => {
  try {
    // Find the current user and populate their liked listings
    const user = await User.findById(req.user._id).populate({
      path: "likedListing",
      populate: {
        path: "owner", // If you want to show the owner of each listing
      },
    });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/listings");
    }

    // Render the liked listings page with the user's liked listings
    res.render("listing/showLikedListings", {
      likedListings: user.likedListing,
      currentUser: req.user,
    });
  } catch (err) {
    console.error(err);
    req.flash(
      "error",
      "Something went wrong while fetching your liked listings"
    );
    res.redirect("/listings");
  }
});

// Route to toggle like/unlike a listing
router.get("/:id/like", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    // Check if the listing is already liked
    const isLiked = user.likedListing.includes(id);

    if (isLiked) {
      // If already liked, remove it (unlike)
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedListing: id },
      });
    } else {
      // If not liked, add it to liked listings
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedListing: id },
      });
    }

    // Redirect back to the listing page or the page they were on
    res.redirect(req.get("referer") || `/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash(
      "error",
      "Something went wrong with liking/unliking this listing"
    );
    res.redirect(`/listings/${req.params.id}`);
  }
});

module.exports = router;
