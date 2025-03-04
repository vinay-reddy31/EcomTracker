import { NextResponse } from "next/server";
import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";

export async function GET() {
  try {
    console.log("API route /api/cron hit! Running product scraping...");

    await connectToDB();
    const products = await Product.find({});

    if (!products.length) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) {
          console.log(`No data found for ${currentProduct.url}`);
          return currentProduct;
        }

        if (currentProduct.currentPrice > scrapedProduct.currentPrice) {
          const updatedPriceHistory = [
            ...currentProduct.priceHistory,
            { price: scrapedProduct.currentPrice },
          ];
          const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
            discountRate: scrapedProduct.discountrate,
            isOutOfStock: scrapedProduct.isOutofStock,
          };

          const updatedProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { new: true }
          );

          const emailNotifType = getEmailNotifType(
            scrapedProduct,
            currentProduct
          );
          if (emailNotifType && updatedProduct.users.length > 0) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
              image: updatedProduct.image,
            };

            const emailContent = await generateEmailBody(
              productInfo,
              emailNotifType
            );
            const userEmails = updatedProduct.users.map(
              (user: any) => user.email
            );
            await sendEmail(emailContent, userEmails);
          }
          return updatedProduct;
        }

        return currentProduct;
      })
    );

    return NextResponse.json({
      message: "Product scraping completed successfully!",
      updatedProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
