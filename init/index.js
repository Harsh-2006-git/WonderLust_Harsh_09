const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Listing = require(path.join(__dirname, "../models/listing.js"));
const initdata = require(path.join(__dirname, "data.js"));

const DB_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/Wonderlust";

async function initializeDatabase() {
  try {
    await mongoose.connect(DB_URL);
    console.log("🗄️ Database connected successfully");

    // Clear existing data
    const deleteResult = await Listing.deleteMany({});
    console.log(`♻️ Cleared ${deleteResult.deletedCount} existing listings`);

    // Transform data - including adding owner field
    const transformedData = initdata.data.map((item) => ({
      ...item,
      owner: "67ea3be7602de8000ec1bdac", // Owner field added here
      image: typeof item.image === "object" ? item.image.url : item.image,
    }));

    // Insert new data
    const insertedListings = await Listing.insertMany(transformedData);
    console.log(`✅ Successfully inserted ${insertedListings.length} listings`);
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

initializeDatabase();
