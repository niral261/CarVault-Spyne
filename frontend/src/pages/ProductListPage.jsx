// ProductListPage.js

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "@clerk/clerk-react";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { ProductCard } from "../components/ProductCard"; // Import the ProductCard component

function ProductListPage() {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const { session, isLoaded } = useSession();

  useEffect(() => {
    const fetchCars = async () => {
      if (!session || !session.getToken) {
        setError("Please log in to view your cars.");
        return;
      }

      try {
        const token = await session.getToken();
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cars/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setCars(response.data);
      } catch (err) {
        console.error("Error fetching user's cars:", err);
        setError("Failed to fetch cars.");
      }
    };

    if (isLoaded && session) {
      fetchCars();
    }
  }, [session, isLoaded]);

  const handleSearch = async () => {
    if (!session || !session.getToken) {
      setError("Please log in to search cars.");
      return;
    }

    try {
      const token = await session.getToken();
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cars/search?query=${searchQuery}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setCars(response.data);
    } catch (error) {
      console.error("Error searching cars:", error);
      setError("Failed to search cars.");
    }
  };

  if (!isLoaded) {
    return <p>Loading session...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto my-6">
      <div className="mb-4">
        <Input
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} className="mt-2">
          Search
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {cars.length === 0 ? (
        <p>No cars found. Please make sure you are logged in and have posted cars.</p>
      ) : (
        cars.map((car) => (
          <ProductCard key={car._id} car={car} /> // Use ProductCard component
        ))
      )}
    </div>
  );
}

export default ProductListPage;