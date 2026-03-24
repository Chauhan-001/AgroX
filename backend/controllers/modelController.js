// controllers/mlController.js

import fetch from "node-fetch";

export const predictCrop = async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    return res.json(data);

  } catch (err) {
    console.log("ML ERROR:", err);
    res.status(500).json({ error: "ML server error" });
  }
};

export const getCropDetails = async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/crop-detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    return res.json(data);

  } catch (err) {
    console.log("CROP DETAIL ERROR:", err);
    res.status(500).json({ error: "Crop detail fetch failed" });
  }
};