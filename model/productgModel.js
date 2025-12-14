const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: String,
    slug: String,
    name: String,

    price: Number,
    originalPrice: Number,
    discount: Number,
    rating: Number,

    productImage: String,
    galleryImages: [String],

    category: String,
    // subCategory: String,

    // 🔥 Store full Meesho product safely
    rawData: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
