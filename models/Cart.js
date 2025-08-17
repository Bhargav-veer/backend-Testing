import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, index: true, unique: true },
  items: { type: [itemSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
