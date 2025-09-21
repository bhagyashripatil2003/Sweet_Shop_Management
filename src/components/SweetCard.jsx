// src/components/SweetCard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SweetCard = ({ sweet, onSweetUpdate }) => {
  const [currentSweet, setCurrentSweet] = useState(sweet);

  const handlePurchase = async () => {
    if (currentSweet.quantity <= 0) {
      alert("This sweet is out of stock!");
      return;
    }
    
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        `http://localhost:8000/api/sweets/${currentSweet.id}/purchase/`,
        {}, // The purchase endpoint doesn't need a body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      // Update the quantity in the state
      const updatedSweet = { ...currentSweet, quantity: currentSweet.quantity - 1 };
      setCurrentSweet(updatedSweet);
      if (onSweetUpdate) {
        onSweetUpdate(updatedSweet);
      }
      
      console.log(`Successfully purchased ${currentSweet.name}.`);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to purchase sweet. Please try again.');
    }
  };

  return (
    <div className="sweet-card">
      <h3>{currentSweet.name}</h3>
      <p>Category: {currentSweet.category}</p>
      <p>Price: ${currentSweet.price}</p>
      <p>Quantity: {currentSweet.quantity}</p>
      <button 
        onClick={handlePurchase} 
        disabled={currentSweet.quantity <= 0}
      >
        {currentSweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default SweetCard;