import express from "express";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51Ovjk205VooYGXFiCohBVLdJRpYrgVCPWCSRDevGMajngZXhqfsltu28ZkzBVbh7FOFX2dHYUklWAAVSrukiRHFE00aD5D2JoT"
);
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

router.post("/create-checkout-session", async (req, res) => {
  // const { products } = req.body;

  // console.log(products);

  // const lineItems = products.map((product) => ({
  //   price_data: {
  //     currency: "usd",
  //     product_data: {
  //       name: product.name,
  //       images: [`${req.protocol}://${req.get("host")}${product.image}`],
  //     },
  //     unit_amount: product.price,
  //   },
  //   quantity: product.quantity,
  // }));

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   mode: "payment",
  //   success_url: "",
  //   cancel_url: "",
  // });

  // res.json({ id: session.id });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100, // Stripe amounts are in cents
        },
        quantity: product.qty,
      })),
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
