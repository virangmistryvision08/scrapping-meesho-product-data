const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { scrapeMeeshoProducts } = require("./scrape2");

async function scrapeMeeshoCategory() {
  const url = "https://www.meesho.com/women-ethnic-wear/clp/1hjl";

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(html);

    // Extract next.js data
    const scriptContent = $("#__NEXT_DATA__").html();

    if (!scriptContent) {
      console.log("JSON not found!");
      return;
    }

    const jsonData = JSON.parse(scriptContent);

    // Product data inside Next.js JSON
    const products =
      jsonData.props.pageProps.initialState ||
      jsonData.props.pageProps?.data?.catalogs ||
      [];

    let productList = [];

    if (products?.clpListing?.listing?.products) {
      productList = products.clpListing.listing.products;
    } else if (products?.initialProducts) {
      productList = products.initialProducts;
    } else if (products?.data?.catalogs) {
      productList = products.data.catalogs;
    } else {
      console.log("❌ No product list found");
      return;
    }

    // console.log("Found products:", productList.length);

    // console.log(products.clpListing.listing.products,'products')
    // console.log("Total Products Found:", products.length);

    // Format products
    // const formattedProducts = productList.map(
    //   (p) => ({
    //     // console.log(Object.values(p)[0],'productsss')
    //     id: p.id,
    //     name: p.name,
    //     price: p.min_product_price,
    //     discount: p.total_discount_in_rs,
    //     // rating: p.rating?.value,
    //     // ratings_count: p.rating?.count,
    //     description: p.description,
    //     images: p.images,
    //     // category: p.category,
    //     subCategory: p.sub_sub_category_name,
    //   })
    // );

    const formattedProducts = productList.flatMap((p) => {
      const innerArray = Object.values(p)[1]; // extract array inside object

      //   console.log(p,'innerArray')

      return innerArray.map((prod) => ({
        id: prod.id ?? null,
        name: prod.name ?? null,
        price: prod.min_product_price ?? prod.price ?? null,
        discount: prod.total_discount_in_rs ?? prod.discount ?? null,
        description: prod.description ?? null,
        images: prod.images ?? [],
        product_id: prod.product_id ?? null,
        slug: prod.slug ?? null,
        subCategory: prod.sub_sub_category_name ?? prod.subCategory ?? null,
      }));
    });

    // console.log(formattedProducts, "formattedProducts");

    scrapeMeeshoProducts(formattedProducts);

    // // Save JSON file
    // fs.writeFileSync(
    //   "meesho_products.json",
    //   JSON.stringify(formattedProducts, null, 2)
    // );

    console.log("✔ Products saved to meesho_products.json");
  } catch (err) {
    console.error("Scraping error:", err.message);
  }
}

scrapeMeeshoCategory();
