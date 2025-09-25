import React, { useState } from "react";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/user/forget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Forgot Password
                </h2>

                {message && (
                    <div className="mb-4 text-center text-sm font-medium text-blue-600">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
