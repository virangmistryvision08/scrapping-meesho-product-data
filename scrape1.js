require("dotenv").config();
const connectDB = require("./config/dbConnect");

const axios = require("axios");
const cheerio = require("cheerio");
const Product = require("./model/productgModel");

async function scrapeMeeshoCategory() {
  await connectDB();

  // const url = "https://www.meesho.com/women-ethnic-wear/clp/1hjl";
  // const url = "https://www.meesho.com/western-dresses/clp/5S3C"
  // const url = "https://www.meesho.com/menswear/clp/40NO"
  // const url = "https://www.meesho.com/women-men-kids-footwear/clp/15mz"
  // const url = "https://www.meesho.com/home-decor-furnishings/clp/668x"
  // const url = "https://www.meesho.com/beauty/facet_collection/30983?title=Beauty"
  // const url = "https://www.meesho.com/accessories-bags/facet_collection/43174"
  const url = "https://www.meesho.com/grocery/facet_collection/81087?title=Grocery"

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html"
      }
    });

    const $ = cheerio.load(html);
    const scriptContent = $("#__NEXT_DATA__").html();

    if (!scriptContent) {
      console.log("❌ __NEXT_DATA__ not found");
      return;
    }

    const jsonData = JSON.parse(scriptContent);

    const state =
      jsonData?.props?.pageProps?.initialState ||
      jsonData?.props?.pageProps?.data ||
      {};

    let productList = [];

    if (state?.clpListing?.listing?.products) {
      productList = state.clpListing.listing.products;
    } else if (Array.isArray(state?.initialProducts)) {
      state.initialProducts.forEach((item) => {
        if (Array.isArray(item?.products)) {
          productList.push(...item.products);
        }
      });
    } else if (Array.isArray(state?.data?.catalogs)) {
      productList = state.data.catalogs;
    } else {
      console.log("❌ No products found");
      return;
    }

    console.log(`✔ Found products`);

    for (const prod of productList) {
      prod.products.map(async (p) => {
        await Product.updateOne(
          { productId: p.product_id },
          {
            productId: p.product_id,
            slug: p.slug,
            name: p.name,

            price: p.min_product_price,
            originalPrice: p.original_price,
            discount: p.total_discount_in_rs,
            rating: p.catalog_reviews_summary?.average_rating || null,

            productImage: p.image,
            galleryImages: p.product_images?.map(i => i.url) || [],

            category: p.sub_sub_category_name,

            rawData: p
          },
          { upsert: true }
        );
      })
    }

    console.log("✔ Products saved successfully");

  } catch (err) {
    console.error("❌ Scraping error:", err.message);
  }
}

scrapeMeeshoCategory();
