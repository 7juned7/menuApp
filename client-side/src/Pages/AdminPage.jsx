import React, { useState } from "react";
import { useCartContext } from "../Context/CartContext";
import { useOrderContext } from "../Context/OrderContext";

const AdminPage = () => {
    const { customerOrder, setCustomerOrder } = useOrderContext();
    console.log(customerOrder)
    const { cart, setCart } = useCartContext();
    const [foodData, setFoodData] = useState({ name: "", category: "", price: "", image: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [orders, setOrders] = useState([]);

    // Add new food item
    const addFoodItem = () => {
        if (!foodData.name || !foodData.price) return;
        setCart([...cart, { ...foodData, id: Date.now(), quantity: 1 }]);
        setFoodData({ name: "", category: "", price: "", image: "" });
    };

    // Delete food item
    const deleteFoodItem = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    // Edit food item
    const editFoodItem = (index) => {
        setFoodData(cart[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    // Update food item
    const updateFoodItem = () => {
        let updatedCart = [...cart];
        updatedCart[editIndex] = { ...foodData };
        setCart(updatedCart);
        setIsEditing(false);
        setFoodData({ name: "", category: "", price: "", image: "" });
    };

    // Simulate order creation
    const createOrder = () => {
        if (cart.length === 0) return;
        const newOrder = {
            id: `ORD-${Date.now()}`,
            items: [...cart],
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: "Pending",
        };
        setOrders([...orders, newOrder]);
        setCart([]); // Clear cart after order
    };

    // Update order status
    const updateOrderStatus = (orderId, status) => {
        setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

            {/* Add/Edit Form */}
            <div className="mb-6 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-bold">{isEditing ? "Edit Food" : "Add Food"}</h3>
                <input
                    type="text"
                    placeholder="Food Name"
                    value={foodData.name}
                    onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
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
                    type="number"
                    placeholder="Price"
                    value={foodData.price}
                    onChange={(e) => setFoodData({ ...foodData, price: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={foodData.image}
                    onChange={(e) => setFoodData({ ...foodData, image: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                />
                <button
                    onClick={isEditing ? updateFoodItem : addFoodItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isEditing ? "Update" : "Add"}
                </button>
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
                    {cart.map((item, index) => (
                        <tr key={item.id} className="border">
                            <td className="border p-2">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            </td>
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">{item.category}</td>
                            <td className="border p-2">${item.price}</td>
                            <td className="border p-2">
                                <button onClick={() => editFoodItem(index)} className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
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

            {/* Orders Section */}
            <h3 className="text-xl font-bold mb-2">Orders</h3>
            {customerOrder.length === 0 ? (
                <p className="text-gray-600">No orders placed yet.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Order ID</th>
                            <th className="border p-2">Items</th>
                            <th className="border p-2">Total Price</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerOrder.map((order) => (
                            <tr key={order.id} className="border">
                                <td className="border p-2">{order.id}</td>
                                <td className="border p-2">
                                    {order.items.map(item => (
                                        <div key={item.id}>{item.name} (x{item.quantity})</div>
                                    ))}
                                </td>
                                <td className="border p-2">${order.total}</td>
                                <td className="border p-2">{order.status}</td>
                                <td className="border p-2">
                                    <button onClick={() => updateOrderStatus(order.id, "Processing")} className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                                        Processing
                                    </button>
                                    <button onClick={() => updateOrderStatus(order.id, "Delivered")} className="px-3 py-1 bg-green-500 text-white rounded">
                                        Delivered
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Simulate Order Button */}
            <div className="mt-4">
                <button onClick={createOrder} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Create Order
                </button>
            </div>
        </div>
    );
};

export default AdminPage;
