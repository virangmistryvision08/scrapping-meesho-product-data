const axios = require("axios");
const cheerio = require("cheerio");
const Product = require("./model/productgModel");

async function scrapeMeeshoProducts(products) {
  try {
    // for (const prod of products) {
    //   const url = `https://www.meesho.com/${prod.slug}/p/${prod.product_id}`;
    //   console.log("Scraping:", url);

    //   const { data: html } = await axios.post(url, {
    //     headers: {
    //       "User-Agent": "Mozilla/5.0",
    //     },
    //   });

    //   console.log(html, "html");

    //   const $ = cheerio.load(html);
    //   const scriptContent = $("#__NEXT_DATA__").html();

    //   if (!scriptContent) {
    //     console.log("❌ JSON not found for:", url);
    //     continue;
    //   }

    //   const json = JSON.parse(scriptContent);

    //   console.log(json, "json");

      // Product details inside Next.js JSON
      //   const product =
      //     json.props.pageProps.productDetails ||
      //     json.props.pageProps.data ||
      //     null;

      //   if (!product) {
      //     console.log("❌ No product details found for:", url);
      //     continue;
      //   }

      // -------------------------------
      // 📌 FORMAT PRODUCT ACCORDING TO YOUR MODEL
      // -------------------------------

      //   const productData = {
      //     productId: product.id,
      //     name: product.name,
      //     price: product.price,
      //     rating: product.rating?.average || 0,

      //     productImage: product.images?.[0] || "",
      //     galleryImages: product.images || [],

      //     sizing: product.sizing || [],
      //     highlights: product.highlights || [],

      //     variants: (product.variants || []).map(v => ({
      //       variantId: v.id || "",
      //       color: v.color || "",const axios = require("axios");
          for (const prod of products) {
            const url = `https://www.meesho.com/api/v1/product/${prod.product_id}`;

            const body = {
              include_catalog: true,
              ad_active: true,
            };

            headers = {
              "Content-Type": "application/json",
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              Connection: "keep-alive",
              "accept-language": "en-US,en;q=0.9",
              origin: "https://www.meesho.com",
              referer: `https://www.meesho.com/${prod.slug}/p/${prod.product_id}`,
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-fetch-dest": "empty",
              "meesho-iso-country-code": "IN",
              "x-wishlist-aggregation-required": "true",
              "sec-ch-ua": `"Chromium";v="142", "Google Chrome";v="142", "Not=A?Brand";v="99"`,
              "sec-ch-ua-platform": `"Windows"`,
              "sec-ch-ua-mobile": "?0",

              // Your real browser user-agent
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",

              // Optional: send cookies from your browser session
              Cookie: "ORDER_BLOCK_EXPERIMENT_COOKIE=0.94; isDownload=...",
            };

            const response = await axios.post(url, body, { headers });
            console.log(response, "response");

            // // Debug
            // console.log("Page loaded successfully!");

            // const $ = cheerio.load(html);
            // const scriptContent = $("#__NEXT_DATA__").html();

            // if (!scriptContent) {
            //   console.log("❌ JSON not found for:", url);
            //   continue;
            // }

            // const json = JSON.parse(scriptContent);
            // console.log("JSON extracted successfully!", json.props?.pageProps);

            // Now continue with your product extraction...
          }
        } catch (err) {
          console.error("❌ Scraper Error:", err.message);
        }

      //       size: v.size || "",
      //       image: v.image || "",
      //       slug: v.slug || ""
      //     })),

      //     slug: prod.slug,
      //     category: product.category_name || ""
      //   };

      // -------------------------------
      // 📌 SAVE or UPDATE IN MONGODB
      // -------------------------------

      //   await Product.findOneAndUpdate(
      //     { productId: product.id },
      //     productData,
      //     { upsert: true, new: true }
      //   );
}

module.exports = { scrapeMeeshoProducts };
