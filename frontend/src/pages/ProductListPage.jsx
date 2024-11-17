import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "@clerk/clerk-react";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { ProductCard } from "../components/ProductCard";

function ProductListPage() {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if a search was made
  const { session, isLoaded } = useSession();

  useEffect(() => {
    const fetchCars = async () => {
      if (!session || !session.getToken) {
        setError("Please log in to view your cars.");
        return;
      }

      try {
        const token = await session.getToken();
        const response = await axios.get(`https://car-vault-spyne.vercel.app/api/cars/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setCars(response.data);
        setSearchPerformed(false); 
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
      const response = await axios.get(
        `https://car-vault-spyne.vercel.app/api/cars/search?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCars(response.data);
      setSearchPerformed(true);
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
      <div className="mb-4 flex">
        <Input
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-4/5"
        />
        <Button onClick={handleSearch} className="ml-2 w-40">
          Search
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {cars.length === 0 ? (
        searchPerformed ? (
          <p>No cars found for "{searchQuery}".</p>
        ) : (
          <p>No cars available. Please make sure you are logged in and have posted cars.</p>
        )
      ) : (
        cars.map((car) => <ProductCard key={car._id} car={car} />)
      )}
    </div>
  );
}

export default ProductListPage;
