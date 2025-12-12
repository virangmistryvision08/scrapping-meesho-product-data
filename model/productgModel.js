const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  rating: Number,

  productImage: String,
  galleryImages: [String],

  sizing: [String],
  highlights: [String],

  variants: [
    {
      variantId: String,
      color: String,
      size: String,
      image: String,
      slug: String
    }
  ],

  slug: String,
  category: String
}, { timestamps: true });

module.exports = mongoose.model("Products", productSchema);
