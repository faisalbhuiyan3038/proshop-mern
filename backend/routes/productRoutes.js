import express from "express";
const router = express.Router();
import products from "../data/products.js";
import Product from "./../models/productModel.js";

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
