This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## .env.local
```bash
create a .env.local
BRIGHT_DATA_USERNAME=###
BRIGHT_DATA_PASSWORD=###
MONGODB_URI=###
EMAIL_PASSWORD=###
EMAIL=###
EMAIL_APP_PASSWORD=###

```
### E-Com Tracker
## Description
The Price Tracking Web Application is a full-stack web application designed to help users monitor product prices and receive automated notifications when prices drop. By leveraging web scraping and cron jobs, the application ensures that users stay updated with the latest price changes, enabling them to purchase products at the best possible prices.

The system allows users to select and track products from various online marketplaces. Once a user subscribes to a product, the application continuously monitors its price and automatically sends an email notification whenever a price drop occurs. This eliminates the need for manual tracking and ensures that users never miss a great deal.

## Key Features
🔹 User-Friendly Price Tracking
Users can search for and select products they wish to track.
The application stores product details, including the current price and URL.
🔹 Automated Price Monitoring
Uses web scraping to periodically check product prices from e-commerce websites.
The backend runs cron jobs to automate price checking at scheduled intervals.
🔹 Real-Time Price Alerts via Email
Whenever a price drop is detected, the system automatically sends an email notification to the user.
The email contains details such as the new price, previous price, and product link.


## How to Use It?
![image](https://github.com/user-attachments/assets/f132b474-b8a5-409b-b28f-52b897734609)

Copy the link of a Product
![image](https://github.com/user-attachments/assets/c267e920-e4dc-4311-ae2f-515d45e32fb4)

paste it in E-Com- Tracker
![image](https://github.com/user-attachments/assets/94ec39ac-2d01-4691-969b-905cfb5cb445)

Then, the product is listed in Trending section 
![image](https://github.com/user-attachments/assets/18fc9d4e-ad01-4402-9b39-2a8be9cd3bff)

Open the product to see all the details of the product
![image](https://github.com/user-attachments/assets/efd11c74-fa03-4772-8b8c-884a7629cbaa)

To keep a track of the product enter email and click on submit
![image](https://github.com/user-attachments/assets/df6a608d-dd93-447c-8a5b-25f2aa72888e)

The tracking is in progresssss.....
![image](https://github.com/user-attachments/assets/2c9436dc-105c-46ce-b4bb-f218b2e91e20)







The product is live on https://ecom-tracker-app.vercel.app/


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
