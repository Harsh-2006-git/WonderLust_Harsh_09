# Wonderlust 🌍✨

![WhatsApp Image 2025-04-03 at 01 08 48_6ade1229](https://github.com/user-attachments/assets/5333abee-d9fe-4514-9731-11f00f7f69b3)


## A Complete Accommodation Booking Platform

Wonderlust is a comprehensive accommodation booking platform that connects travelers with unique places to stay around the world. From cozy rooms to luxury villas, city apartments to countryside retreats - find the perfect place for your next adventure.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### For Travelers 🧳
- **Discover** 🔍 - Browse thousands of unique properties worldwide with advanced filtering options
- **Search** 🗺️ - Find accommodations by location, dates, price range, amenities, and property type
- **Book** 📅 - Secure instant booking with flexible cancellation options
- **Pay** 💳 - Multiple payment methods with secure transaction processing
- **Review** ⭐ - Share experiences with ratings and detailed reviews
- **Save** ❤️ - Create wishlists of favorite properties for future trips
- **Messaging** 💬 - Direct communication with hosts before and during your stay
- **Experience Booking** 🏄‍♂️ - Discover and book local experiences, tours, and activities

### For Hosts 🏠
- **List Property** 📝 - Create detailed listings with descriptions, amenities, house rules, and pricing
- **Photo Management** 📷 - Upload high-quality photos with automatic enhancement features
- **Calendar Management** 📆 - Set availability, create custom pricing for seasons/events
- **Booking Management** 📊 - Accept/decline booking requests, manage reservations
- **Messaging Center** 📨 - Communicate with guests through the integrated messaging system
- **Analytics Dashboard** 📈 - Track performance, views, bookings, and earnings
- **Multi-property Management** 🏘️ - Manage multiple listings from a single account
- **Smart Pricing** 💲 - Get pricing suggestions based on demand, location, and seasons

### Platform Features 🚀
- **User Authentication** 🔐 - Secure login/signup with email or social media accounts
- **Profile Management** 👤 - Detailed user profiles with verification options
- **Notification System** 🔔 - Real-time alerts for bookings, messages, and updates
- **Multi-language Support** 🌐 - Platform available in multiple languages
- **Responsive Design** 📱 - Seamless experience across all devices (desktop, tablet, mobile)
- **Review System** ✍️ - Two-way review system for hosts and guests
- **Secure Payments** 🔒 - Protected payment processing with multiple currency support
- **Admin Dashboard** ⚙️ - Complete management tools for platform administrators

## Technology Stack

### Frontend 🎨
- **EJS (Embedded JavaScript)** - Template engine for dynamic content rendering
- **HTML5/CSS3** - Structure and styling with responsive design
- **JavaScript** - Client-side functionality and interactions
- **Bootstrap** - Responsive layout framework
- **AJAX** - Asynchronous data loading for smooth user experience
- **Mapbox API** - For location visualization and property mapping

### Backend 🛠️
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **Passport.js** - Authentication middleware
- **Multer** - File upload handling (for property images)



## Installation 💻

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/wonderlust.git
cd wonderlust

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed the database (optional)
npm run seed

# Start the development server
npm run dev
```

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- NPM or Yarn

## Project Structure 📁

```
wonderlust/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # MongoDB/Mongoose models
├── public/             # Static files (CSS, JS, images)
├── routes/             # API and view routes
├── utils/              # Utility functions
├── views/              # EJS templates
├── tests/              # Test files
├── app.js              # Express app setup
├── server.js           # Server entry point
└── package.json        # Project metadata and dependencies
```


## Database Models 💾

### User Model 👤
- Basic profile (name, email, password)
- Advanced profile (bio, profile picture, verification status)
- Account settings (notifications, privacy settings)
- Host/guest preferences

### Listing Model 🏠
- Basic details (title, description, property type)
- Location data (address, coordinates, neighborhood)
- Amenities and features
- Photos and media
- Pricing and availability
- House rules and policies

### Booking Model 🗓️
- Reservation details (dates, guests)
- Payment information
- Status tracking
- Guest/host communication
- Reviews and ratings



Project Link: [https://github.com/yourusername/wonderlust](https://github.com/yourusername/wonderlust)
