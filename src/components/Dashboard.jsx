import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SweetCard from "./SweetCard";

const Dashboard = () => {
  // State variables for managing sweets list, search query, and sorting option.
  const [sweets, setSweets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();

  // Function to handle updates to a single sweet, ensuring the UI stays in sync.
  const handleSweetUpdate = (updatedSweet) => {
    setSweets((prevSweets) =>
      prevSweets.map((sweet) =>
        sweet.id === updatedSweet.id ? updatedSweet : sweet
      )
    );
  };

  // Function to handle user logout. It clears the token and redirects to the login page.
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // useEffect hook to fetch and sort sweets based on the search query and sort option.
  useEffect(() => {
    const fetchAndSortSweets = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/sweets/", {
          params: { search: searchQuery },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        let sortedSweets = [...response.data];

        if (sortOption === "price_asc") {
          sortedSweets.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price_desc") {
          sortedSweets.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name_asc") {
          sortedSweets.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setSweets(sortedSweets);

      } catch (error) {
        console.error("Failed to fetch sweets:", error);
        navigate("/login");
      }
    };

    fetchAndSortSweets();
  }, [searchQuery, sortOption, navigate]);

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">Available Sweets</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out shadow-md"
        >
          Logout
        </button>
      </div>
      
      {/* Container for search and sort controls */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          />
        </div>
        
        <div className="flex-shrink-0">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          >
            <option value="default">Sort by...</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* List of sweets */}
      <div className="sweets-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.length > 0 ? (
          sweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onSweetUpdate={handleSweetUpdate}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No sweets found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
