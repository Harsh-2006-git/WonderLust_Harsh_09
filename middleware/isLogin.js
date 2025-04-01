const Listing = require("../models/listing.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store the URL they are requesting so you can redirect back after login
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to access this resource");
    return res.redirect("/auth");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Change to res.locals (with an 's')
  } else {
    res.locals.redirectUrl = "/listings"; // Add a default redirect
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to edit this listing");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};
