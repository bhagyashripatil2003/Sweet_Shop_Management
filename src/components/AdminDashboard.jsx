// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Corrected import statement

const AdminDashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });
  const [editingSweet, setEditingSweet] = useState(null);
  const navigate = useNavigate();

  const fetchSweets = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:8000/api/sweets/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSweets(response.data);
    } catch (error) {
      console.error('Failed to fetch sweets:', error);
      navigate('/login'); 
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [navigate]);

  const handleAddSweet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        'http://localhost:8000/api/sweets/',
        newSweet,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setNewSweet({ name: '', category: '', price: '', quantity: '' });
      fetchSweets(); // Refresh the list
    } catch (error) {
      console.error('Failed to add sweet:', error);
      alert('Failed to add sweet. Make sure you are an admin user.');
    }
  };

  const handleDeleteSweet = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:8000/api/sweets/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchSweets(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete sweet:', error);
      alert('Failed to delete sweet. Make sure you are an admin user.');
    }
  };

  const handleEditSweet = (sweet) => {
    setEditingSweet(sweet);
    setNewSweet({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    });
  };

  const handleUpdateSweet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(
        `http://localhost:8000/api/sweets/${editingSweet.id}/`,
        newSweet,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setEditingSweet(null);
      setNewSweet({ name: '', category: '', price: '', quantity: '' });
      fetchSweets(); // Refresh the list
    } catch (error) {
      console.error('Failed to update sweet:', error);
      alert('Failed to update sweet. Make sure you are an admin user.');
    }
  };

  const handleCancelEdit = () => {
    setEditingSweet(null);
    setNewSweet({ name: '', category: '', price: '', quantity: '' });
  };
  
  return (
    <div className="admin-dashboard-container">
      <h2>Admin Panel</h2>
      <div className="add-sweet-form">
        <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
        <form onSubmit={editingSweet ? handleUpdateSweet : handleAddSweet}>
          <input
            type="text"
            placeholder="Name"
            value={newSweet.name}
            onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newSweet.category}
            onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newSweet.price}
            onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newSweet.quantity}
            onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })}
            required
          />
          <button type="submit">{editingSweet ? 'Update Sweet' : 'Add Sweet'}</button>
          {editingSweet && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </form>
      </div>

      <div className="sweet-list-admin">
        <h3>Manage Sweets</h3>
        <ul>
          {sweets.map(sweet => (
            <li key={sweet.id}>
              {sweet.name} - ${sweet.price} - Qty: {sweet.quantity}
              <button onClick={() => handleEditSweet(sweet)}>Edit</button>
              <button onClick={() => handleDeleteSweet(sweet.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;