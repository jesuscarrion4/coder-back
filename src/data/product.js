import ProductManager from "../managers/ProductManager.js";

export const productos = new ProductManager(
  "./src/data/data.json",
  "data"
);