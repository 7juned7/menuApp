import React, { useEffect, useState } from 'react';
import { useCartContext } from '../../Context/CartContext';
import { useDropzone } from 'react-dropzone';

const FoodAdmin = () => {
    const { cart, setCart } = useCartContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [menu, setMenu] = useState([]);
    const [foodData, setFoodData] = useState({
        name: "",
        description: "",
        category: "",
        foodType: "",
        price: "",
        availability: true,
        image: "",
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setFoodData(prevData => ({
                ...prevData,
                image: file, // Store the file directly
            }));

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreview(reader.result); // Show preview
            };
        }
    };
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        maxSize: 2 * 1024 * 1024, // 2MB limit
    });




    // Add new food item

    const addFoodItem = async () => {
        const token = localStorage.getItem("token")
        if (!foodData.name || !foodData.description || !foodData.category || !foodData.foodType || !foodData.price) {
            alert("All fields are required!");
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", foodData.name);
            formData.append("description", foodData.description);
            formData.append("category", foodData.category);
            formData.append("foodType", foodData.foodType);
            formData.append("price", foodData.price);
            formData.append("availability", foodData.availability);

            if (foodData.image) {
                formData.append("image", foodData.image); // Send file directly
            }
            const response = await fetch("http://localhost:5000/api/additem", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(foodData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Item added successfully!");
                setFoodData({
                    name: "",
                    description: "",
                    category: "",
                    foodType: "",
                    price: "",
                    availability: true,
                    image: "",
                });
                setPreview(null);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error adding food item:", error);
        } finally {
            setLoading(false);
        }
    };

    // Delete food item
    const deleteFoodItem = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    // Edit food item
    const editFoodItem = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:5000/api/getitem/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            const image = data.item.image
                ? `data:image/jpeg;base64,${data.item.image}`
                : ""; // Set empty string if no image is available

            if (response.ok) {
                setFoodData({
                    name: data.item.name || "",
                    description: data.item.description || "",
                    category: data.item.category || "",
                    foodType: data.item.foodType || "",
                    price: data.item.price || "",
                    availability: data.item.availability ?? true,
                    image: image, // Reset to allow new file uploads
                });


                setPreview(data.item.image ? `data:image/jpeg;base64,${data.image}` : null);
                setIsEditing(true);
                setEditIndex(id); // Track the item being edited
            } else {
                console.error("Error fetching item:", data.message);
            }
        } catch (error) {
            console.error("Error fetching item:", error);
        }
    };

    const updateFoodItem = () => {
        console.log(foodData)
    }




    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getmenu");
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status}`);
                }
                const data = await response.json();
                setMenu(data.menu);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchMenuData();
        console.log(foodData)

    }, [foodData]);

    return (
        <>
            {/* Add/Edit Form */}
            <div className="p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-bold mb-4">Add Food Item</h3>

                <input
                    type="text"
                    placeholder="Food Name"
                    value={foodData.name}
                    onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={foodData.description}
                    onChange={(e) => setFoodData({ ...foodData, description: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={foodData.category}
                    onChange={(e) => setFoodData({ ...foodData, category: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Food Type (Veg/Non-Veg)"
                    value={foodData.foodType}
                    onChange={(e) => setFoodData({ ...foodData, foodType: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={foodData.price}
                    onChange={(e) => setFoodData({ ...foodData, price: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <label className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        checked={foodData.availability}
                        onChange={() => setFoodData({ ...foodData, availability: !foodData.availability })}
                        className="mr-2"
                    />
                    Available
                </label>

                {/* Image Upload Section */}
                <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer bg-white rounded mb-2">
                    <input {...getInputProps()} />
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover mx-auto" />
                    ) : (
                        <p>Drag & drop an image here, or click to select one</p>
                    )}
                </div>

                {/* Submit Button */}
                {
                    !isEditing ? (<button
                        onClick={addFoodItem}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                        disabled={loading}
                    >
                        Add Item
                    </button>) : (<button
                        onClick={updateFoodItem}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                        disabled={loading}
                    >
                        Update Item
                    </button>)
                }

            </div>

            {/* Food Items List */}
            <h3 className="text-xl font-bold mb-2">Food Items</h3>
            <table className="w-full border-collapse border border-gray-200 mb-6">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Image</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((item, index) => (
                        <tr key={item._id} className="border">
                            <td className="border p-2">
                                <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            </td>
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">{item.category}</td>
                            <td className="border p-2">${item.price}</td>
                            <td className="border p-2">
                                <button onClick={() => editFoodItem(item._id)} className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                                    Edit
                                </button>
                                <button onClick={() => deleteFoodItem(item.id)} className="px-3 py-1 bg-red-500 text-white rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default FoodAdmin;
