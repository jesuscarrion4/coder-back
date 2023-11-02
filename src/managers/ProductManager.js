import fs from "fs";
import path from "path";

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = "../data/data.json";
        this.loadProducts();
    }

    async loadProducts() {
        this.products = await this.getProducts();
        if (this.products.length === 0) {
            this.productIdCounter = 1;
        } else {
            const lastProduct = this.products[this.products.length - 1];
            this.productIdCounter = lastProduct.id + 1;
        }
    }

    async addProduct(data) {
        if (!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock) {
            return "campos no válidos";
        }

        const productExists = this.products.some((product) => product.code === data.code);
        if (productExists) {
            return "error: código ya está en uso";
        }

        const newProduct = {
            id: this.productIdCounter,
            ...data
        };
        
        this.products.push(newProduct);
        this.productIdCounter++;
        await this.guardarProductos();
        console.log("se ha agregado correctamente");
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            if (data === '') {
                return [];
            }
            return JSON.parse(data);
        } catch (err) {
            console.error('Error al leer los productos:', err);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id === id);
            return product;
        } catch (e) {
            console.log('Error al obtener el producto:', e);
            throw e;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id);

            if (productIndex === -1) {
                console.log('Producto no encontrado');
                return;
            }

            if (updatedProduct.code !== products[productIndex].code && this.isCodeInUse(updatedProduct.code, products)) {
                console.log('Error: El código ya está en uso por otro producto');
                return;
            }

            products[productIndex] = {
                ...products[productIndex],
                ...updatedProduct
            };

            await this.guardarProductos(products);
            console.log('Producto actualizado');
        } catch (e) {
            console.log('Error al obtener el producto:', e);
        }
    }

    isCodeInUse(code, products) {
        return products.some((product) => product.code === code);
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return console.log('Producto no encontrado');
        }

        this.products.splice(productIndex, 1);
        await this.guardarProductos();

        console.log('Producto eliminado');
    }

    async guardarProductos(products) {
        try {
            const data = JSON.stringify(products || this.products, null, 2);
            await fs.promises.writeFile(this.path, data, 'utf-8');
            console.log('Productos guardados correctamente');
        } catch (err) {
            console.log('Error al guardar los productos');
        }
    }
}

(async () => {
    const manager = new ProductManager("../data/data.json");

    await manager.addProduct({
        title: "Cafe en granos",
        description: "Americano",
        price: 2.99,
        thumbnail: "img/cafe.jpg",
        code: "5678",
        stock: 10,
    });

    try {
        const products = await manager.getProducts();
        console.log(products);

        const product = await manager.getProductById(1);
        console.log(product);

        await manager.addProduct({
            title: "Cafe",
            description: "london",
            price: 3.99,
            thumbnail: "img/cafe.jpg",
            code: "5564",
            stock: 10,
        });


        await manager.deleteProduct(2);
    } catch (err) {
        console.error('Error:', err);
    }
    (async () => {
      const manager = new ProductManager("../data/data.json");
  
      try {
          // Crear un nuevo producto
          await manager.addProduct({
              title: "cafe americano",
              description: "nuevo producto",
              price: 3.99,
              thumbnail: "img/nuevo_producto.jpg",
              code: "9876",
              stock: 5,
          });
  
          const products = await manager.getProducts();
          console.log("Lista de productos actualizada:", products);
      } catch (err) {
          console.error('Error:', err);
      }
  })();
})();

export default ProductManager;
