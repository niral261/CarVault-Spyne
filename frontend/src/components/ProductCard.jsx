import { useNavigate } from "react-router-dom";
import Button from "./Button";

// eslint-disable-next-line react/prop-types
export function ProductCard({ car }) {
    const navigate = useNavigate();
    
    const truncateDescription = (description, maxLength = 300) => {
        if (description && description.length > maxLength) {
          return `${description.substring(0, maxLength)}...`;
        }
        return description;
    };
      
    const handleViewDetails = () => {
      navigate(`/product-detail/${car._id}`);
    };

    const parsedTags = Array.isArray(car.tags) ? JSON.parse(car.tags) : car.tags;
    console.log(Array.isArray(car.tags));

    return (
      <div 
      className="border rounded-lg shadow-md p-4 mb-4 bg-stone-900 transition-transform transform hover:shadow-xl hover:-translate-y-2 hover:rotate-x-3"
        style={{ perspective: "1000px" }}
      >
        {car.images && (
          <img
            src={car.images[0]}
            alt="Car"
            loading="lazy"
            className="w-full h-100 object-cover rounded-lg mb-4"
          />
        )}
  
        <div className="border-b pb-2 mb-2">
          <h3 className="text-lg font-semibold">{car.title}</h3>
        </div>
  
        <div className="mt-2">
          <p>{truncateDescription(car.description)}</p>
  
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.isArray(parsedTags) && parsedTags.length > 0 ? (
              parsedTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                  style={{ margin: '5px' }}
                >
                  {tag}
                </span>
              ))
            ) : (
              <p>No tags available</p>
            )}
          </div>
        </div>
  
        <div className="mt-4">
          <Button
            className="hover:bg-pink-500 hover:border-pink-500"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    );
  }
  