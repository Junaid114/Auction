import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const createProduct = async () => {
    try {
      const response = await axios.post('/api/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: 0 });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const updateProduct = async (productId, updatedProduct) => {
    try {
      await axios.put(`/api/products/${productId}`, updatedProduct);
      const updatedProducts = products.map((product) =>
        product.id === productId ? updatedProduct : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h2>Product Management</h2>

      <h3>Create Product</h3>
      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Product Price"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
        }
      />
      <button onClick={createProduct}>Add Product</button>
      <h3>Product List</h3>
      {products.map((product) => (
        <div key={product.id}>
          <p>
            {product.name} - ${product.price}
          </p>

          <button
            onClick={() =>
              updateProduct(product.id, { ...product, name: 'Updated Product' })
            }
          >
            Update
          </button>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ProductManagement;
