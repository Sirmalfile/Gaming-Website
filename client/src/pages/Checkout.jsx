import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const Checkout = () => {
    const { user, axios, cartItems, currency } = useAppContext();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleStripePayment = async () => {
        if (!user) {
            alert("Please login before placing an order.");
            return;
        }

        if (!selectedAddress) {
            alert("Please select a shipping address.");
            return;
        }

        setLoading(true);
        try {
            // ✅ Send order details + email to backend
            const { data } = await axios.post("/api/order/stripe", {
                userId: user._id,
                items: cartItems,
                address: selectedAddress,
                email: user.email, // ✅ important for confirmation email
            });

            if (data.success && data.url) {
                // Redirect to Stripe checkout
                window.location.href = data.url;
            } else {
                alert("Payment Error: " + data.message);
            }
        } catch (error) {
            console.error("Stripe payment error:", error);
            alert("Something went wrong while processing payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 pb-16 flex flex-col items-center">
            <h1 className="text-3xl font-semibold mb-6 uppercase">Checkout</h1>

            {/* Address selection UI */}
            <div className="border border-gray-300 rounded-lg p-4 w-full max-w-3xl mb-6">
                <h2 className="text-xl font-medium mb-3">Select Delivery Address</h2>
                {user?.addresses?.length > 0 ? (
                    user.addresses.map((addr, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-3 mb-2 border rounded cursor-pointer ${selectedAddress?._id === addr._id
                                    ? "border-primary bg-primary/10"
                                    : "border-gray-300"
                                }`}
                        >
                            <p className="font-medium">
                                {addr.name} – {addr.phone}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {addr.street}, {addr.city}, {addr.state}, {addr.zip}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No addresses saved.</p>
                )}
            </div>

            {/* Order summary */}
            <div className="border border-gray-300 rounded-lg p-4 w-full max-w-3xl mb-6">
                <h2 className="text-xl font-medium mb-3">Order Summary</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartItems.map((item, i) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-none">
                            <p>{item.product.name}</p>
                            <p>
                                {currency}
                                {item.product.offerPrice * item.quantity}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Payment button */}
            <button
                onClick={handleStripePayment}
                disabled={loading || !selectedAddress}
                className={`bg-primary text-white px-6 py-3 rounded-lg font-medium ${loading || !selectedAddress
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-primary/80"
                    }`}
            >
                {loading ? "Processing..." : "Pay with Stripe"}
            </button>
        </div>
    );
};

export default Checkout;
