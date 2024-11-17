import { useSession } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '../components/Alert';
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import Button from "../components/Button";
import Label from "../components/Label";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { WithContext as ReactTags } from 'react-tag-input';

function CreateProductPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    const { session, isLoaded } = useSession();

    useEffect(() => {
        const fetchToken = async () => {
            if (session && session.getToken) {
                try {
                    const token = await session.getToken();
                    setToken(token);
                } catch (err) {
                    setError('Error fetching token', err.message);
                }
            }
        };

        fetchToken();
    }, [session, isLoaded]);

    if (!isLoaded) {
        return <p>Loading session...</p>;
    }

    const handleImageChange = (e) => {
        const selectedImages = e.target.files;
        if (selectedImages.length > 10) {
            setError('You can only upload a maximum of 10 images.');
            return;
        }
        setError('');
        setImages(selectedImages);
    };

    const handleTagChange = (newTags) => {
        setTags(newTags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError('Authentication token is missing');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', JSON.stringify(tags.map(tag => tag.text)));

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            await axios.post('http://localhost:8000/api/cars/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Car created successfully!');
            setTitle('');
            setDescription('');
            setTags([]);
            setImages([]);
            setError('');
        } catch (error) {
            setError(`Oops 😥😥 !Publishing car`);
        }
    };

    return (
        <Card className="max-w-3xl mx-auto my-6">
            <CardHeader>
                <CardTitle>Create a New Car</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="tags">Tags</Label>
                        <ReactTags
                            tags={tags}
                            handleDelete={(i) => handleTagChange(tags.filter((tag, index) => index !== i))}
                            handleAddition={(tag) => {
                                if (tags.length < 10) {
                                    handleTagChange([...tags, tag]);
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
                        <Label htmlFor="images">Images</Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>

                    <Button type="submit" className="mt-4 hover:bg-pink-500 hover:border-pink-500" disabled={images.length === 0 || !title || !description || tags.length === 0}>
                        Publish Car
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default CreateProductPage;