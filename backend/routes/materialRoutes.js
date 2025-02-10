const express = require("express");
const Material = require("../models/Material");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body); // Log incoming request

    const { title, type, url, description, course } = req.body;
    console.log("information:", title, type, url, description, course);
    if (!title || !type || !url || !description || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMaterial = new Material({
      title,
      type,
      url,
      description,
      course,
    });

    await newMaterial.save();

    res.status(201).json({
      message: "Material created successfully",
      material: newMaterial,
    });
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 2. Get all materials
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find();

    if (materials.length === 0) {
      return res.status(404).json({ message: "No materials found" });
    }

    res.status(200).json({
      message: "Materials fetched successfully",
      materials,
    });
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. Get a material by ID
router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json({
      message: "Material fetched successfully",
      material,
    });
  } catch (error) {
    console.error("Error fetching material:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
