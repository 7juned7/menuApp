import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
const User = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, role: "customer" }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            console.log(response)
            localStorage.setItem("token", data.token);

            // Decode token to extract role
            const decoded = jwtDecode(data.token);
            console.log("Decoded Token:", decoded);

            const userRole = decoded.role;
            localStorage.setItem("role", userRole);

            if (userRole === "customer") {

                window.location.href = "/";
            }
            if (userRole === "admin") {

                window.location.href = "/admin";
            }

        } catch (err) {
            setError(err.message);
        }
    };
    const handleLogin = async (e) => {

        e.preventDefault();

        if (!username || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            console.log(data)
            localStorage.setItem("token", data.token);

            // Decode token to extract role
            const decoded = jwtDecode(data.token);
            console.log("Decoded Token:", decoded);
            console.log("hello")
            const userRole = decoded.role;
            localStorage.setItem("role", userRole);
            console.log(userRole + "hello")
            if (userRole === "customer") {

                window.location.href = "/";
            }
            if (userRole === "admin") {

                window.location.href = "/admin";
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="username"
                            className="w-full p-2 border rounded"
                            placeholder="Enter email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full mb-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        New User Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default User;
