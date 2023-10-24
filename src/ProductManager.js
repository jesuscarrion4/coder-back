const fs = require("fs"); 

class ProductManager {
  constructor(path) {
    this.path = './data.json';
    this.products = this.leerProductos();
    this.nextId = 1;
  }

  leerProductos() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      if (data === '') {
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error al leer los productos:', err);
      return [];
    }
  }

  guardarProductos() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
      console.log('Productos guardados correctamente');
    } catch (err) {
      console.error('Error al guardar los productos:', err);
    }
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    if (this.products.some(product => product.code === code)) {
      throw new Error('El código del producto ya está en uso.');
    }

    const newProduct = {
      id: this.nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.nextId++;
    this.guardarProductos();

    return newProduct;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      return;
    }

    this.products[productIndex] = {
      id,
      ...updatedProduct,
    };

    this.guardarProductos();
    console.log('Producto actualizado');
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      return console.log('Producto no encontrado');
    }

    this.products.splice(productIndex, 1);
    this.guardarProductos();
    console.log('Producto eliminado');
  }

  getProducts() {
    return this.products;
  }
}

const manager = new ProductManager('./data.json');

manager.addProduct({
  title: "cafe americano",
  description: "granos",
  price: 2.99,
  thumbnail: "img/cafe.jpg",
  code: "5678",
  stock: 10,
});

console.log(manager.getProducts());

const product = manager.getProductById(1);
console.log(product);

manager.updateProduct(1, {
  title: "moka molido",
  description: "ganos",
  price: 3.99,
  thumbnail: "img/moka.jpg",
  code: "5678",
  stock: 5,
});

manager.deleteProduct(2);

module.exports = ProductManager;