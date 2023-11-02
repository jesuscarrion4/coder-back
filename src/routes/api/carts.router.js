import { Router } from 'express';
import { carritos } from '../../data/carts.js';

const cartsRouter = Router();

// Middleware para manejo centralizado de errores
cartsRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, response: "Error interno del servidor" });
});

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await carritos.createCart();
    res.status(201).json({ success: true, response: cart });
  } catch (error) {
    next(error);
  }
});

cartsRouter.get("/", (req, res) => {
  const carts = carritos.getCarts();
  res.status(200).json({ success: true, response: carts });
});

cartsRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = carritos.getCartById(cid);
  if (typeof cart !== "object") {
    next(new Error("Cart not found"));
  }
  res.status(200).json({ success: true, response: cart });
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.query.quantity) || 1;
    const cart = await carritos.addProductsToCart(cid, { pid, quantity });
    if (typeof cart !== "object") {
      next(new Error("Failed to add product to cart"));
    }
    res.status(200).json({ success: true, response: cart });
  } catch (error) {
    next(error);
  }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.query.quantity) || 0;
    const cart = await carritos.deleteProductFromCart(cid, { pid, quantity });
    if (typeof cart !== "object") {
      next(new Error("Failed to delete product from cart"));
    }
    res.status(200).json({ success: true, response: cart });
  } catch (error) {
    next(error);
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await carritos.deleteCart(cid);
    if (cart !== "Cart deleted") {
      next(new Error("Failed to delete cart"));
    }
    res.status(200).json({ success: true, response: cart });
  } catch (error) {
    next(error);
  }
});
export default cartsRouter;