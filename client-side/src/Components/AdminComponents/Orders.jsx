import React, { useEffect } from 'react'
import { useOrderContext } from '../../Context/OrderContext';

const Orders = () => {
    const { customerOrder, setCustomerOrder } = useOrderContext();
    const statusArray = ["pending", "preparing", "ready", "served"];
    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token"); // Get token

            if (!token) {
                console.error("No token found. User not logged in.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/orders", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error fetching orders: ${response.status}`);
                }

                const data = await response.json();
                console.log("Orders fetched:", data);
                setCustomerOrder(data.orders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, []);
    const updateOrderStatus = async (orderId, currentStatus) => {
        const statusArray = ["pending", "preparing", "ready", "served"];
        const nextStatus = statusArray[statusArray.indexOf(currentStatus) + 1];

        if (!nextStatus) return; // No further status update possible

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/order/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });

            if (!response.ok) {
                throw new Error(`Failed to update order status: ${response.status}`);
            }

            const updatedOrder = await response.json();
            setCustomerOrder(customerOrder.map(order =>
                order._id === orderId ? { ...order, status: nextStatus } : order
            ));

            console.log("Order updated:", updatedOrder);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };





    return (<>



        {
            statusArray.map((status) => {
                return (
                    <>
                        <h3 className='my-4 font-bold'>{status} Orders</h3>
                        {
                            customerOrder.length === 0 ? (
                                <p className="text-gray-600">No orders placed yet.</p>
                            ) : (
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border p-2">Order ID</th>
                                            <th className="border p-2">Items</th>
                                            <th className="border p-2">Table No</th>
                                            <th className="border p-2">Total Price</th>
                                            <th className="border p-2">Status</th>
                                            <th className="border p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerOrder.filter((order => order.status === status)).map((order) => (
                                            <tr key={order._id} className="border">
                                                <td className="border p-2">{order._id}</td>
                                                <td className="border p-2">
                                                    {order.items.map(item => (
                                                        <div key={item._id}>{item.name} (x{item.quantity})</div>
                                                    ))}
                                                </td>
                                                <td className="border p-2">{order.tableNumber}</td>
                                                <td className="border p-2">${order.total || "N/A"}</td>
                                                <td className="border p-2">{order.status}</td>
                                                <td className="border p-2">
                                                    {status !== "served" && (
                                                        <p className="px-3 py-1" onClick={() => updateOrderStatus(order._id, order.status)}>
                                                            {statusArray[statusArray.indexOf(order.status) + 1]}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            )
                        }
                    </>
                )
            })
        }


    </>
    )
}

export default Orders