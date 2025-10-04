import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../assets/assets";

const Services = () => {
    const [selectedService, setSelectedService] = useState("Custom PC Build");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        components: {
            processor: "",
            graphicsCard: "",
            motherboard: "",
            ramStorage: "",
            coolingSystem: "",
            powerSupplyCase: "",
        },
        repairDetails: {
            issueDescription: "",
            preferredService: "",
        },
        productService: {
            productName: "",
            issue: "",
        },
        additionalDetails: "",
    });

    const resetForm = () => {
        setFormData({
            fullName: "",
            email: "",
            components: {
                processor: "",
                graphicsCard: "",
                motherboard: "",
                ramStorage: "",
                coolingSystem: "",
                powerSupplyCase: "",
            },
            repairDetails: {
                issueDescription: "",
                preferredService: "",
            },
            productService: {
                productName: "",
                issue: "",
            },
            additionalDetails: "",
        });
        setSelectedService("Custom PC Build");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleComponentChange = (e) => {
        setFormData({
            ...formData,
            components: { ...formData.components, [e.target.name]: e.target.value },
        });
    };

    const handleRepairChange = (e) => {
        setFormData({
            ...formData,
            repairDetails: { ...formData.repairDetails, [e.target.name]: e.target.value },
        });
    };

    const handleProductServiceChange = (e) => {
        setFormData({
            ...formData,
            productService: { ...formData.productService, [e.target.name]: e.target.value },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:4000/api/services/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    serviceType: selectedService,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(`❌ Failed: ${errorData.message || res.statusText}`);
                return;
            }

            const data = await res.json();

            if (data.success) {
                toast.success("✅ Service Request Submitted!");
                resetForm();
            } else {
                toast.error("❌ " + data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("❌ Network error. Please try again.");
        }
    };

    const renderRelatedFields = () => {
        if (selectedService === "Custom PC Build") {
            return (
                <>
                    <input
                        name="processor"
                        placeholder="Processor"
                        value={formData.components.processor}
                        onChange={handleComponentChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        name="graphicsCard"
                        placeholder="Graphics Card"
                        value={formData.components.graphicsCard}
                        onChange={handleComponentChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        name="motherboard"
                        placeholder="Motherboard"
                        value={formData.components.motherboard}
                        onChange={handleComponentChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        name="ramStorage"
                        placeholder="RAM & Storage"
                        value={formData.components.ramStorage}
                        onChange={handleComponentChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        name="coolingSystem"
                        placeholder="Cooling System"
                        value={formData.components.coolingSystem}
                        onChange={handleComponentChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        name="powerSupplyCase"
                        placeholder="Power Supply & Case"
                        value={formData.components.powerSupplyCase}
                        onChange={handleComponentChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </>
            );
        }

        if (selectedService === "PC Repair / Maintenance") {
            return (
                <>
                    <textarea
                        name="issueDescription"
                        placeholder="Describe issue"
                        value={formData.repairDetails.issueDescription}
                        onChange={handleRepairChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <select
                        name="preferredService"
                        value={formData.repairDetails.preferredService}
                        onChange={handleRepairChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    >
                        <option value="">-- Select Service --</option>
                        <option>Hardware Repair</option>
                        <option>Software Troubleshooting</option>
                        <option>Performance Upgrade</option>
                    </select>
                </>
            );
        }

        if (selectedService === "Other Product Service") {
            return (
                <>
                    <input
                        name="productName"
                        placeholder="Product Name"
                        value={formData.productService.productName}
                        onChange={handleProductServiceChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <textarea
                        name="issue"
                        placeholder="Issue / Request"
                        value={formData.productService.issue}
                        onChange={handleProductServiceChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </>
            );
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Our Services Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">Our Services</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-600 p-6 shadow  rounded-lg hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-2 text-white ">Custom PC Build</h3>
                        <p className="text-gray-200 text-sm">
                            Share your gaming needs and preferences, and we’ll craft a PC tailored for performance, style, and budget.
                        </p>
                    </div>
                    <div className="bg-blue-600 p-6 shadow rounded-lg hover:shadow-lg transition">
                        <h3 className="text-xl font-bold text-white mb-2">PC Repair & Maintenance</h3>
                        <p className="text-gray-200 text-sm">
                            Our experts provide fast, reliable repairs and upgrades for hardware and software issues.
                        </p>
                    </div>
                    <div className="bg-blue-600 p-6 shadow rounded-lg hover:shadow-lg transition">
                        <h3 className="text-xl text-white font-bold mb-2">Other Product Services</h3>
                        <p className="text-gray-200 text-sm">
                            From peripherals to accessories, we diagnose and fix issues with a wide range of products.
                        </p>
                    </div>
                </div>
            </div>

            {/* Expert Team Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">Our Expert Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <img
                            src={assets.pc_expart_image}
                            alt="Technician"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-600"
                        />
                        <h3 className="text-lg font-bold">Alex Johnson</h3>
                        <p className="text-gray-600 text-sm">10+ years in custom PC building & gaming rigs</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <img
                            src={assets.pc_expart}
                            alt="Technician"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-600"
                        />
                        <h3 className="text-lg font-bold">Maria Gomez</h3>
                        <p className="text-gray-600 text-sm">Expert in PC troubleshooting and component upgrades</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <img
                            src={assets.pc_expart3}
                            alt="Technician"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-600"
                        />
                        <h3 className="text-lg font-bold">David Lee</h3>
                        <p className="text-gray-600 text-sm">Specialist in water cooling and high-end gaming builds</p>
                    </div>
                </div>
            </div>

            {/* Request Form (unchanged design) */}
            <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Request a Service</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    >
                        <option>Custom PC Build</option>
                        <option>PC Repair / Maintenance</option>
                        <option>Other Product Service</option>
                    </select>

                    {renderRelatedFields()}

                    <textarea
                        name="additionalDetails"
                        placeholder="Additional Details"
                        rows="4"
                        value={formData.additionalDetails}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Submit Request
                    </button>
                </form>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default Services;
