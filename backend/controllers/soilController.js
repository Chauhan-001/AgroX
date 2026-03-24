import fetch from "node-fetch";

/* ================= SOIL PREDICTION CONTROLLER ================= */
export const predictSoil = async (req, res) => {
  try {
    const {
      ph,
      moisture,
      nitrogen,
      phosphorus,
      potassium,
      carbon,
      texture,
      temp,
      rainfall,
    } = req.body;

    // ✅ Validate input
    if (
      ph == null || moisture == null || nitrogen == null ||
      phosphorus == null || potassium == null ||
      carbon == null || !texture || temp == null || rainfall == null
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // ✅ Call Flask API
    const response = await fetch("http://127.0.0.1:7001/api/predict-soil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ph,
        moisture,
        nitrogen,
        phosphorus,
        potassium,
        carbon,
        texture,
        temp,
        rainfall,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({
        success: false,
        error: data.error || "Flask prediction failed"
      });
    }

    // ✅ Send response to React Native
    return res.status(200).json({
      success: true,
      result: data.result,
    });

  } catch (err) {
    console.error("Soil Prediction Error:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};