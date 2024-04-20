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

app.get("/api/config/stripe", (req, res) =>
  res.send({
    publishableKey: process.env.STRIPE_PUBLISH_KEY.toString(),
  })
);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
