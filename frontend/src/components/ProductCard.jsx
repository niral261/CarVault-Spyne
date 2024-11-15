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
  
    return (
      <div className="border rounded-lg shadow-md p-4 mb-4">
        {/* Render the first image if images exist */}
        {car.images && (
          <img
            src={car.images[0]}
            alt="Car"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
  
        <div className="border-b pb-2 mb-2">
          <h3 className="text-lg font-semibold">{car.title}</h3>
        </div>
  
        <div className="mt-2">
          {/* Limit the description to 300 characters */}
          <p>{truncateDescription(car.description)}</p>
  
          {/* Render tags in pink squares with 10px gap */}
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.isArray(car.tags) && car.tags.length > 0 ? (
              car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                  style={{ margin: '5px' }} // 10px distance (5px on each side)
                >
                  {tag}
                </span>
              ))
            ) : (
              <p>No tags available</p>
            )}
          </div>
        </div>
  
        {/* View Details button */}
        <div className="mt-4">
          <Button className=" hover:bg-pink-500 hover:border-pink-500" onClick={handleViewDetails}>View Details</Button>
        </div>
      </div>
    );
  }
  