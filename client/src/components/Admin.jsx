import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  // State for products
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '' });

  // Fetch products from the server
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to add a new product
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products', newProduct);
      console.log('Product added successfully:', response.data);
      setNewProduct({ title: '', price: '' });
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Function to delete a product
  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`/api/products/${productId}`);
      console.log('Product deleted successfully:', response.data);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to edit a product
  const editProduct = (productId) => {
    // Logic to handle the editing of a product
    // You can implement this based on your requirements
    console.log(`Editing product with ID: ${productId}`);
  };

  return (
    <div className="admin-page">
      <div className="product-section">
        <h3>Products:</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => editProduct(product.id)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Add Product:</h4>
        <form onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <button type="submit">Add</button>
        </form>
      </div>

      {/* Add other sections for Users, Timers, Deposits */}
    </div>
  );
};

export default AdminPage;
