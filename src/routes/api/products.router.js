import { Router } from 'express';
import { productos } from '../../data/product.js';
import { productValidator } from '../../middlewares/productValidator.js';
import { imageUploader }  from "../../middlewares/multer.js";

const productsRouter = Router();

// Middleware de manejo de errores
productsRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, response: "Error interno del servidor" });
});

productsRouter.get("/", (req, res) => {
  const limit = req.query.limit;
  const allProducts = productos.getProducts();

  if (!allProducts) {
    return res.status(404).json({ success: false, response: "Something went wrong" });
  }

  if (limit) {
    return res.status(200).json({ success: true, response: allProducts.slice(0, limit) });
  }

  res.status(200).json({ success: true, response: allProducts });
});

productsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const oneProduct = productos.getProductById(id);
  res.status(200).json({ success: true, response: oneProduct });
});

productsRouter.post("/", productValidator, async (req, res) => {
  const {
    title,
    description,
    price,
    code,
    category,
    stock,
    status,
    thumbnails,
  } = req.body;

  const product = {
    title,
    description,
    code,
    price: parseFloat(price),
    status,
    stock: parseInt(stock),
    category,
    thumbnails,
  };

  const newProduct = await productos.addProduct(product);

  if (typeof newProduct !== "object") {
    return res.status(400).json({ success: false, response: newProduct });
  }

  res.status(201).json({ success: true, response: newProduct });
});

productsRouter.post(
  "/img",
  imageUploader.single("image"),
  productValidator,
  async (req, res) => {
    const {
      title,
      description,
      price,
      code,
      category,
      stock,
      status,
      thumbnails,
    } = req.body;

    thumbnails.push(req.file.path);

    const product = {
      title,
      description,
      code,
      price: parseFloat(price),
      status,
      stock: parseInt(stock),
      category,
      thumbnails,
    };

    const newProduct = await productos.addProduct(product);

    if (typeof newProduct !== "object") {
      return res.status(400).json({ success: false, response: newProduct });
    }

    res.status(201).json({ success: true, response: newProduct });
  }
);

productsRouter.put("/:id", async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ success: false, response: "Nothing to update" });
  }

  const product = await productos.updateProduct(id, data);

  if (typeof product !== "object") {
    return res.status(400).json({ success: false, response: product });
  }

  res.status(200).json({ success: true, response: product });
});

productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await productos.deleteProduct(id);

  if (product !== "Product deleted") {
    return res.status(400).json({ success: false, response: product });
  }

  res.status(200).json({ success: true, response: product });
});
export default productsRouter;
