const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("../model/productgModel");

// Connect MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/meesho", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// Required Meesho headers
const axiosClient = axios.create({
  headers: {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    origin: "https://www.meesho.com",
    referer: "https://www.meesho.com/",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
});

// STEP 1 → Get list of products from category page
async function getCategoryProducts(slug = "women-ethnic-wear") {
  const url = "https://www.meesho.com/women-ethnic-wear/clp/1hjl";

  const payload = {
    slug: slug,
    page: 1,
    offset: 0,
    limit: 50,
  };

  const res = await axiosClient.post(url, payload);
  return res.data.catalogs || [];
}

// STEP 2 → Get full product details
async function getFullProduct(productId) {
  const url = `https://www.meesho.com/api/v1/product/${productId}`;

  const res = await axiosClient.get(url);
  return res.data;
}

// STEP 3 → Save Product Into MongoDB
async function saveProduct(full) {
  const pd = full.product;

  const doc = {
    productId: pd.id,
    name: pd.name,
    price: pd.price.value,
    rating: pd.rating,
    productImage: pd.images[0],
    galleryImages: pd.images,
    sizing: pd.sizes || [],
    highlights: pd.highlights || [],
    variants: (pd.variants || []).map((v) => ({
      variantId: v.id,
      color: v.color,
      size: v.size,
      image: v.image,
      slug: v.slug,
    })),
    slug: pd.slug,
    category: pd.categoryName,
  };

  await Product.findOneAndUpdate({ productId: pd.id }, doc, {
    upsert: true,
    new: true,
  });
}

// MAIN FUNCTION
async function scrape_meesho_product() {
  try {
    console.log("Fetching category products...");

    const products = await getCategoryProducts("women-ethnic-wear");

    console.log("Total products:", products.length);

    for (const item of products) {
      console.log("Fetching product:", item.id);

      const full = await getFullProduct(item.id);

      await saveProduct(full);

      console.log("Saved:", item.id);
    }

    console.log("Scraping completed!");
  } catch (err) {
    console.log("Error:", err.message);
  }
}

module.exports = { scrape_meesho_product };
