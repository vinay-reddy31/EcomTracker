"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";
// import cron from "node-cron";
// import { GET } from "../../app/api/cron/route";

// console.log("Next Js application is started");

// cron.schedule("*/5 * * * * *", async () => {
//   console.log("Running product scraping task at scheduled interval");
//   try {
//     await GET();
//     console.log("Product scraping and notification completed successfully.");
//   } catch (error) {
//     console.error("Error during scheduled task:", error);
//   }
// });

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    const startTime = Date.now(); //metrics
    connectToDB();
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (scrapedProduct) {
      console.log("scrapedProduct us Successsssssss");
    }
    // console.log("scrapedProduct", scrapedProduct);
    if (!scrapedProduct) return;

    let productData = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    // const checkExistingTime = Date.now();
    // console.log(
    //   `[Metrics] Time to check existing product: ${
    //     checkExistingTime - startTime
    //   }ms`
    // );

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];
      productData = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const dbUpdateStart = Date.now(); //metrics
    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.url,
      },
      productData,
      { upsert: true, new: true }
    );

    const dbUpdateEnd = Date.now();
    console.log(
      `[Metrics] Time to update database: ${dbUpdateEnd - dbUpdateStart}ms`
    );

    // Time for scraping and database update without revalidation
    const scrapeAndUpdateTime = dbUpdateEnd - startTime;
    console.log(
      `[Metrics] Time for scraping and updating (without revalidation): ${scrapeAndUpdateTime}ms`
    );

    // Revalidate the product page and measure the time it takes
    const revalidateStart = Date.now();

    console.log(
      "Revalidating path for product:",
      `/products/${newProduct._id}`
    );
    revalidatePath(`/products/${newProduct._id}`);

    const revalidateEnd = Date.now();
    console.log(
      `[Metrics] Revalidation trigger time: ${
        revalidateEnd - revalidateStart
      }ms`
    );

    const totalEndTime = Date.now();
    console.log(
      `[Metrics] Total time for scrape, update, and revalidation: ${
        totalEndTime - startTime
      }ms`
    );

    // Calculate time with revalidation by subtracting the revalidation time
    const totalWithRevalidationTime = totalEndTime - startTime;
    const revalidationTime = revalidateEnd - revalidateStart;
    const totalWithoutRevalidationTime =
      totalWithRevalidationTime - revalidationTime;

    console.log(
      `[Metrics] Time with revalidation: ${totalWithRevalidationTime}ms`
    );
    console.log(
      `[Metrics] Time without revalidation: ${totalWithoutRevalidationTime}ms`
    );
  } catch (error) {
    console.log(`Failed to Create/update Product:`, error);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    const products = await Product.find();
    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

interface User {
  email: string;
}

export async function adduserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);
    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });
      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
