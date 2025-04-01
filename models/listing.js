const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    image: {
      type: String,
      default: "https://wallpapercave.com/wp/wp3307431.jpg",
      set: function (v) {
        if (typeof v === "object" && v.url) {
          return v.url; // Extract URL if object is provided
        }
        return v === "" ? this.default : v;
      },
    },
    price: {
      type: Number,
      min: 0,
    },
    country: String,
    location: String,
    // In your Listing model, make sure you have this:
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
