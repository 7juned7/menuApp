import React, { useState } from "react";
import FoodAdmin from "../Components/AdminComponents/FoodAdmin";
import Orders from "../Components/AdminComponents/Orders";
import User from "./User";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("Order Panel"); // Default to Food Panel

    return (<>
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

            {/* Navigation Tabs */}
            <div className="flex w-full justify-center mb-6">
                <button
                    onClick={() => setActiveTab("Order Panel")}
                    className={`w-full px-4 py-2 transition  ${activeTab === "Order Panel" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"
                        }`}
                >
                    Order Panel
                </button>
                <button
                    onClick={() => setActiveTab("Food Panel")}
                    className={`w-full px-4 py-2 transition  ${activeTab === "Food Panel" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"
                        }`}
                >
                    Food Panel
                </button>
            </div>

            {/* Conditionally Render Sections */}
            {activeTab === "Food Panel" && <FoodAdmin />}
            {activeTab === "Order Panel" && <Orders />}
        </div>

    </>
    );
};

export default AdminPage;
