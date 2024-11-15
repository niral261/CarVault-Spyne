import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import Button from "../components/Button";
import Label from "../components/Label";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { WithContext as ReactTags } from 'react-tag-input';
import { useSession } from '@clerk/clerk-react';

const UpdateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    images: [],
  });
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); 
  const [token, setToken] = useState(null);

  

  const fetchCarDetail = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cars/${id}`);
      setCar(data);
      setFormData({
        title: data.title,
        description: data.description,
        tags: data.tags.map(tag => ({ id: tag, text: tag })),
        images: data.images || [],
      });
    } catch (error) {
      console.error("Error fetching car details", error);
      setError("Failed to load car details.");
    }
  };

  useEffect(() => {
    fetchCarDetail();
  }, [id]);

  const { session, isLoaded } = useSession();

    useEffect(() => {
        const fetchToken = async () => {
            if (session && session.getToken) {
                try {
                    const token = await session.getToken();
                    setToken(token);
                } catch (err) {
                    setError('Error fetching token',err.message);
                }
            }
        };
        
        fetchToken();
    }, [session, isLoaded]);

    if (!isLoaded) {
        return <p>Loading session...</p>;
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagsChange = (newTags) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: newTags,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleImageRemoval = (url) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((imgUrl) => imgUrl !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append('title', formData.title);
    updatedFormData.append('description', formData.description);
    updatedFormData.append('tags', JSON.stringify(formData.tags.map(tag => tag.text)));

    imageFiles.forEach((file) => {
      updatedFormData.append('images', file);
    });

    try {
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cars/${id}`, updatedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Car updated successfully!');
      navigate('/myproducts');
    } catch (error) {
      setError(`Error updating car: ${error.response?.data?.message || error.message}`);
    }
  };

  if (!car) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-5xl mx-auto my-6">
      <CardHeader>
        <CardTitle>Update Car: {car.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="tags">Tags</Label>
            <ReactTags
              tags={formData.tags}
              handleDelete={(i) => handleTagsChange(formData.tags.filter((_, index) => index !== i))}
              handleAddition={(tag) => {
                if (formData.tags.length < 10) {
                  handleTagsChange([...formData.tags, tag]);
                } else {
                  setError('You can only add up to 10 tags.');
                }
              }}
              inputFieldPosition="bottom"
              placeholder="Add features, company as Tags"
              autocomplete
              style={{
                tagsInput: {
                  border: '1px solid #ccc',
                  padding: '5px',
                  borderRadius: '4px',
                },
                tag: {
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '4px',
                  display: 'inline-block',
                },
                tagRemove: {
                  marginLeft: '8px',
                  cursor: 'pointer',
                  color: '#ff0000',
                },
              }}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="images">Image URLs (optional)</Label>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {formData.images.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-500 text-white px-2 py-1 rounded-lg text-sm"
                >
                  <span className="truncate">{url}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-400 text-xs"
                    onClick={() => handleImageRemoval(url)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="imageFiles">Or Upload Images</Label>
            <Input
              type="file"
              id="imageFiles"
              name="imageFiles"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />
          </div>

          <div className="mt-4 space-x-2">
            <Button
              type="submit"
              variant="secondary"
              className="bg-blue-500 hover:bg-pink-500 hover:border-pink-500 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProductPage;
