import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js"; // Verifies Firebase token

const cartRouter = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get the logged-in user's cart
 * @access  Private (Firebase Auth)
 */
cartRouter.get("/", authUser, getUserCart);

/**
 * @route   POST /api/cart
 * @desc    Add an item to the cart
 * @access  Private (Firebase Auth)
 */
cartRouter.post("/", authUser, addToCart);

/**
 * @route   PATCH /api/cart
 * @desc    Update the entire cart or specific items
 * @access  Private (Firebase Auth)
 */
cartRouter.patch("/", authUser, updateCart);

export default cartRouter;
