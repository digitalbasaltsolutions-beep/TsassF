'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/ecommerce/products');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/ecommerce/products', { 
        title, 
        price: parseFloat(price), 
        stock: parseInt(stock, 10) 
      });
      setTitle('');
      setPrice('');
      setStock('');
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ecommerce Products</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleAddProduct} className="flex space-x-4">
          <input type="text" placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)} required className="flex-2 border rounded-md px-3 py-2 text-sm" />
          <input type="number" step="0.01" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} required className="flex-1 border rounded-md px-3 py-2 text-sm" />
          <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required className="flex-1 border rounded-md px-3 py-2 text-sm" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Add Product</button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: any) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock} in stock
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No products found. Start adding some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
