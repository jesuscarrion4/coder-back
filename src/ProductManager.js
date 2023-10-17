class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  getProducts() {
    return this.products;
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;

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

    return newProduct;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product;
  }

  updateProduct(id, updatedData) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedData };

    return this.products[productIndex];
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products.splice(productIndex, 1);
  }
}


const productManager = new ProductManager();


const products = productManager.getProducts();
console.log(products); // []


const newProduct = productManager.addProduct({
  title: 'caffe americano',
  description: 'granos finos',
  price: 200,
  thumbnail: 'imagen',
  code: 'abc123',
  stock: 25,
});
console.log(newProduct);


const updatedProducts = productManager.getProducts();
console.log(updatedProducts);


try {
  const productById = productManager.getProductById(newProduct.id);
  console.log(productById);
} catch (error) {
  console.error(error.message);
}


try {
  const updatedProduct = productManager.updateProduct(newProduct.id, { price: 250 });
  console.log(updatedProduct);
} catch (error) {
  console.error(error.message);
}


try {
  productManager.deleteProduct(newProduct.id);
  console.log('Producto eliminado');
} catch (error) {
  console.error(error.message);
}


try {
  productManager.deleteProduct(newProduct.id);
  console.log('Producto eliminado');
} catch (error) {
  console.error(error.message);
}