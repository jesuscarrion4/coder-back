import fs from 'fs';

class CartManager {
    constructor(path, collectionName) {
        this.path = path;
        this.collectionName = collectionName;
        this.carts = [];
        this.idCounter = 0;
        this.init();
    }

    async init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                this.carts = JSON.parse(data);
                this.idCounter = this.carts.length !== 0 ? this.carts[this.carts.length - 1].id : 0;
                console.log(`Archivo ${this.path} cargado correctamente.`);
            } else {
                await this.write();
            }
        } catch (error) {
            console.error(`Error al leer el archivo ${this.path}: ${error}`);
        }
    }

    async write() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            console.log(`Archivo ${this.path} guardado correctamente.`);
        } catch (error) {
            console.error(`Error al escribir el archivo ${this.path}: ${error}`);
        }
    }

    createCart() {
    this.idCounter++;
    const cart = { id: this.idCounter, products: [] };
    this.carts.push(cart);
    this.write(); // Guarda el carrito en el archivo JSON
    return { carritos: this.carts }; // Devuelve un objeto con la estructura deseada
}

    getCarts() {
        return this.carts;
    }

    getCartById(cid) {
        return this.carts.find((cart) => cart.id == cid) || "Not found";
    }

    async addProductsToCart(cid, product) {
        if (!this.validateProductData(product)) {
            return "Missing or invalid product data";
        }

        const cart = this.getCartById(cid);

        if (cart === "Not found") {
            return "Cart not found";
        }

        const productIndex = cart.products.findIndex((prod) => prod.pid == product.pid);

        if (productIndex === -1) {
            cart.products.push(product);
        } else {
            cart.products[productIndex].quantity += product.quantity;
        }

        this.write();
        return cart;
    }

    async deleteProductFromCart(cid, product) {
        if (!product.pid) {
            return "Missing product ID";
        }

        const cart = this.getCartById(cid);

        if (cart === "Not found") {
            return "Cart not found";
        }

        const productIndex = cart.products.findIndex((prod) => prod.pid == product.pid);

        if (productIndex === -1) {
            return "Product not found in cart";
        }

        if (!product.quantity) {
            cart.products.splice(productIndex, 1);
        } else {
            cart.products[productIndex].quantity -= product.quantity;
        }

        this.write();
        return cart;
    }

    async deleteCart(cid) {
        const index = this.carts.findIndex((cart) => cart.id == cid);

        if (index === -1) {
            return "Not found";
        }

        this.carts.splice(index, 1);
        this.write();
        return "Cart deleted";
    }

    validateProductData(product) {
        return product.pid && product.quantity;
    }
}

export default CartManager;