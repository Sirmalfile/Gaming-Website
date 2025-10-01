import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// POST - Create Service Request
router.post("/create", async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();

    res.status(201).json({
      success: true,
      message: "Service request created successfully!",
      data: newService,
    });
  } catch (err) {
    console.error("❌ Error saving service:", err);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not save service request.",
    });
  }
});

export default router;
