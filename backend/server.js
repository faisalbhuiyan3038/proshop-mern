import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
const port = process.env.PORT || 5000;

connectDB();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use("api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  console.log(products);

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        image: product.image,
      },
      unit_amount: product.price,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "",
    cancel_url: "",
  });

  res.json({ id: session.id });
});

app.use("/api/config/stripe", (req, res) =>
  res.send({
    clientSecret: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISH_KEY,
  })
);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
