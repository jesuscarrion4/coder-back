const express = require("express");
const ProductManager = require("./ProductManager.js");

const app  = express();
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/products",  async (req, res) => {
    const limit = req.query.limit;
    const products =  await productManager.getProducts();

    if (limit) {
        return res.send(products.slice(0, limit));
    }

    res.send(products);
});

app.get("/products/:pid", async (req, res ) => {
    const pid = parseInt(req.params.pid, 10);
    const products = await productManager.getProductById();

    const product = products.find(({id}) => id === pid );

    res.send(product);
});

app.listen(8080, ()=> console.log("ready"));
