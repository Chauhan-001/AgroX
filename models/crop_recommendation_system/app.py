from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import json
import numpy as np

app = Flask(__name__)
CORS(app)

# ---------------- LOAD MODELS ----------------
encoder = pickle.load(open("models/encoder.pkl", "rb"))
scaler = pickle.load(open("models/scaler.pkl", "rb"))
model_gbc = pickle.load(open("models/model_gbc.pkl", "rb"))

# ---------------- LOAD JSON DATA ----------------
with open("crop_agriculture_data.json") as f:
    crop_data = json.load(f)

with open("crop_data.json") as f:
    profit_data = json.load(f)

# ---------------- SAFE FLOAT ----------------
def safe_float(value):
    try:
        return float(value)
    except:
        return 0

# ---------------- PREDICT CROP ----------------
def predict_crop(N, P, K, temperature, humidity, ph, rainfall):

    input_df = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=['N','P','K','temperature','humidity','ph','rainfall']
    )

    input_scaled = scaler.transform(input_df)
    probs = model_gbc.predict_proba(input_scaled)[0]

    probs = np.array(probs)
    top3 = probs.argsort()[-3:][::-1]

    crops = encoder.inverse_transform(top3)

    return [str(c).lower() for c in crops]

# ---------------- CALCULATE PROFIT ----------------
def calculate_profit(crop):

    data = profit_data.get(crop)

    if not data:
        return {}

    revenue = data["yield"] * data["price"]
    profit = revenue - data["min_cost"]

    return {
        "cost": data["min_cost"],
        "yield": data["yield"],
        "price": data["price"],
        "risk": data["risk"],
        "revenue": revenue,
        "profit": profit
    }

# ================= API: PREDICT =================
@app.route('/api/predict', methods=['POST'])
def predict():

    try:
        data = request.get_json()

        N = safe_float(data.get('N'))
        P = safe_float(data.get('P'))
        K = safe_float(data.get('K'))
        temperature = safe_float(data.get('temperature'))
        humidity = safe_float(data.get('humidity'))
        ph = safe_float(data.get('ph'))
        rainfall = safe_float(data.get('rainfall'))

        crops = predict_crop(N, P, K, temperature, humidity, ph, rainfall)

        crop_details = {}

        for crop in crops:
            if crop in crop_data:
                crop_details[crop] = {
                    "info": crop_data[crop],
                    "profit": calculate_profit(crop)
                }

        return jsonify({
            "success": True,
            "crops": crops,
            "details": crop_details
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ================= API: SINGLE CROP DETAIL =================
@app.route('/api/crop-detail', methods=['POST'])
def crop_detail():

    try:
        data = request.get_json()
        crop = data.get("crop", "").lower()

        details = crop_data.get(crop)

        if not details:
            return jsonify({
                "success": False,
                "message": "Crop not found"
            }), 404

        return jsonify({
            "success": True,
            "crop": crop,
            "details": details,
            "profit": calculate_profit(crop)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ================= RUN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)