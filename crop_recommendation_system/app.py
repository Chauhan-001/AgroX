from flask import Flask, render_template, request
import pandas as pd
import pickle
import json
import numpy as np

app = Flask(__name__)

# ---------------- LOAD MODELS ----------------
encoder = pickle.load(open("models/encoder.pkl", "rb"))
scaler = pickle.load(open("models/scaler.pkl", "rb"))
model_gbc = pickle.load(open("models/model_gbc.pkl", "rb"))

# ---------------- LOAD JSON DATA ----------------
with open("crop_agriculture_data.json") as f:
    crop_data = json.load(f)

# ---------------- PREDICT CROP ----------------
def predict_crop(N, P, K, temperature, humidity, ph, rainfall):

    input_df = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=['N','P','K','temperature','humidity','ph','rainfall']
    )

    input_scaled = scaler.transform(input_df)

    probs = model_gbc.predict_proba(input_scaled)[0]

    probs = np.array(probs)   # 🔥 FIX

    top3 = probs.argsort()[-3:][::-1]

    crops = encoder.inverse_transform(top3)

    return [str(c).lower() for c in crops]   # 🔥 FIX


# ---------------- CALCULATE PROFIT ----------------
with open("crop_data.json") as f:
    profit_data = json.load(f)
def calculate_profit(crop):

    data = profit_data[crop]   # 🔥 CHANGE HERE

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


# ---------------- HOME PAGE ----------------
@app.route('/')
def home():
    return render_template("index.html")


# ---------------- PREDICT ROUTE ----------------
@app.route('/predict', methods=['POST'])
def predict():

    try:
        N = float(request.form['N'])
        P = float(request.form['P'])
        K = float(request.form['K'])
        temperature = float(request.form['temperature'])
        humidity = float(request.form['humidity'])
        ph = float(request.form['ph'])
        rainfall = float(request.form['rainfall'])

        crops = predict_crop(N, P, K, temperature, humidity, ph, rainfall)

        crop_details = {}

        for crop in crops:
            if crop in crop_data:
                crop_details[crop] = calculate_profit(crop)

        return render_template(
            "select_crop.html",
            crops=crops,
            crop_details=crop_details
        )

    except Exception as e:
        return f"Prediction Error: {str(e)}"


# ---------------- CROP DETAIL PAGE ----------------
@app.route('/crop_detail', methods=['POST'])
def crop_detail():

    crop = request.form['crop'].lower()

    details = crop_data.get(crop)

    return render_template("crop_detail.html", crop=crop, details=details)


# ---------------- RUN APP ----------------
if __name__ == "__main__":
    app.run(debug=True)