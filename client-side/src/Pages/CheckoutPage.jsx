import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../Context/CartContext";
import { useOrderContext } from "../Context/OrderContext";

export function CheckoutPage() {
    const Navigate = useNavigate()
    const { cart, setCart, setItemCount } = useCartContext();
    const { customerOrder, setCustomerOrder } = useOrderContext()
    const [customer, setCustomer] = useState({ name: "", tableNo: "", payment: "" });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderData, setOrderData] = useState(null); // Store order details
    console.log(cart)
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (customer.name && customer.tableNo && customer.payment) {
            const orderData = {
                tableNumber: customer.tableNo,
                items: cart.map(item => ({
                    itemId: item._id,  // Ensure the backend expects `_id`
                    name: item.name,
                    quantity: item.quantity
                }))
            };

            console.log("Sending Order Data:", orderData); // Debugging before request

            try {
                const response = await fetch("http://localhost:5000/api/order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || `HTTP error! Status: ${response.status}`);
                }

                console.log("Order Placed Successfully:", result);
            } catch (error) {
                console.error("Error placing order:", error);
            }
        }
    };


    if (orderPlaced) {
        Navigate("../admin")
        return (
            <div className="p-6 max-w-3xl mx-auto flex flex-col items-center justify-center h-screen bg-white rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold">Thank You!</h2>
                <p className="text-gray-600">Your order has been placed successfully.</p>
                <pre className="text-left text-sm bg-gray-100 p-4 rounded">{JSON.stringify(orderData, null, 2)}</pre>
                <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <div className="space-y-4">
                {cart.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${item.price * item.quantity}</span>
                    </div>
                ))}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={customer.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                />
                <input
                    type="text"
                    name="tableNo"
                    placeholder="Table Number"
                    value={customer.tableNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                />
                <select
                    name="payment"
                    value={customer.payment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Select Payment Method</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash-on-delivery">Cash on Delivery</option>
                </select>
            </div>

            <button
                onClick={handleCheckout}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
            >
                Place Order
            </button>
        </div>
    );
}
