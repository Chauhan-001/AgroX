from flask import Flask, request, jsonify
import numpy as np
import joblib

app = Flask(__name__)


model = joblib.load("soil_prediction_model.pkl")
texture_encoder = joblib.load("texture_encoder.pkl")
soil_encoder = joblib.load("soil_encoder.pkl")


# ================= ROOT CHECK =================
@app.route('/')
def home():
    return jsonify({
        "message": "Soil Prediction API is running 🚀"
    })


# ================= SOIL PREDICTION API =================
@app.route('/api/predict-soil', methods=['POST'])
def predict_soil():
    try:
        data = request.get_json()

        # ✅ Extract values from JSON
        ph = float(data.get('ph'))
        moisture = float(data.get('moisture'))
        nitrogen = float(data.get('nitrogen'))
        phosphorus = float(data.get('phosphorus'))
        potassium = float(data.get('potassium'))
        carbon = float(data.get('carbon'))
        texture = data.get('texture')
        temp = float(data.get('temp'))
        rainfall = float(data.get('rainfall'))

        # ✅ Encode texture
        texture_encoded = texture_encoder.transform([texture])[0]

        # ✅ Prepare input
        features = np.array([[
            ph,
            moisture,
            nitrogen,
            phosphorus,
            potassium,
            carbon,
            texture_encoded,
            temp,
            rainfall
        ]])

        # ✅ Predict
        prediction = model.predict(features)

        # ✅ Decode result
        soil_type = soil_encoder.inverse_transform(prediction)[0]

        return jsonify({
            "success": True,
            "result": soil_type
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7001, debug=True)