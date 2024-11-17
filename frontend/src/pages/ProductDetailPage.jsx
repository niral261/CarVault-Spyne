import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import Button from "../components/Button";
import Alert from '../components/Alert';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchCarDetail = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/cars/${id}`);
      setCar(data);
    } catch (error) {
      console.error("Error fetching car details", error);
      setError("Failed to load car details.");
    }
  };

  useEffect(() => {
    fetchCarDetail();
  }, [id]);

  const handleDelete = async () => {
    console.log("Deleting car with id:", id);
    try {
      await axios.delete(`http://localhost:8000/api/cars/${id}`);
      alert("Car deleted successfully!");
      navigate("/myproducts");
    } catch (error) {
      console.error("Error deleting car", error);
      setError("Failed to delete car.");
    }
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  if (!car) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-5xl mx-auto my-6 bg-stone-900 ">
      <CardHeader>
        <CardTitle>{car.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div className="flex gap-6">
          <div className="w-1/3 relative">
            <div className="flex items-center justify-center">
              {/* Left Arrow */}
              <button
                onClick={goToPreviousImage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full"
              >
                &#8592;
              </button>

              <img
                src={car.images[currentImageIndex]}
                alt={`Car ${currentImageIndex}`}
                className="w-full h-auto rounded-lg"
                style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
              />

              <button
                onClick={goToNextImage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full"
              >
                &#8594;
              </button>
            </div>
          </div>

          <div className="w-2/3">
            <p>{car.description}</p>
            <div className="mt-4 space-x-2">
              <Button onClick={() => navigate(`/update-product/${id}`)} variant="secondary" className="border-green-500 text-green-500 hover:text-white hover:border-gray-800 hover:bg-green-500">
                Update Product
              </Button>
              <Button onClick={handleDelete} variant="destructive" className=" border-red-500 text-red-500 hover:text-white hover:border-gray-800 hover:bg-red-500 ">
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetailPage;  