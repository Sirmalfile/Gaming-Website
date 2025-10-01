import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },

    components: {
      processor: String,
      graphicsCard: String,
      motherboard: String,
      ramStorage: String,
      coolingSystem: String,
      powerSupplyCase: String,
    },

    repairDetails: {
      issueDescription: String,
      preferredService: String,
    },

    productService: {
      productName: String,
      issue: String,
    },

    additionalDetails: String,
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
