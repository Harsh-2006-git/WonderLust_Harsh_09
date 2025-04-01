const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

module.exports = {
  // Index - List all listings
  index: async (req, res) => {
    try {
      const AllListing = await Listing.find({});
      res.render("listing/index", { AllListing });
    } catch (err) {
      console.error("Error fetching listings:", err);
      req.flash("error", "Error loading listings");
      res.redirect("/");
    }
  },

  // Render new listing form
  renderNewForm: (req, res) => {
    res.render("listing/newListing");
  },

  // Create a new listing
  createListing: async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  },

  // Show a specific listing
  showListing: async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listing/show", { listing });
  },

  // Render edit form
  renderEditForm: async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listing/edit", { listing });
  },

  // Update a listing
  updateListing: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  },

  // Delete a listing
  deleteListing: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete this listing");
      return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  },

  // Add listing to user's liked listings
  likedListing: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Check if listing exists
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }

      // Check if user already liked the listing
      const user = await User.findById(userId);
      if (user.likedListing.includes(id)) {
        req.flash("error", "You already liked this listing");
        return res.redirect(`/listings`);
      }

      // Add to liked listings
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { likedListing: id } }, // Prevents duplicates
        { new: true }
      );

      req.flash("success", "Successfully added to liked listings!");
      res.redirect(`/listings`);
    } catch (err) {
      console.error("Error in likedListing:", err);
      req.flash("error", "Something went wrong");
      res.redirect("/listings");
    }
  },
};
