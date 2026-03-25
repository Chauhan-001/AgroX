from flask import Flask, request, jsonify
import numpy as np
import joblib

app = Flask(__name__)

# ================= LOAD MODELS =================
try:
    model = joblib.load("soil_prediction_model.pkl")
    texture_encoder = joblib.load("texture_encoder.pkl")
    soil_encoder = joblib.load("soil_encoder.pkl")
    print("✅ Models loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", e)


# ================= ROOT CHECK =================
@app.route('/')
def home():
    return jsonify({
        "success": True,
        "message": "Soil Prediction API is running 🚀"
    })


# ================= VALIDATION FUNCTION =================
def validate_inputs(data):
    try:
        ph = float(data.get('ph'))
        moisture = float(data.get('moisture'))
        nitrogen = float(data.get('nitrogen'))
        phosphorus = float(data.get('phosphorus'))
        potassium = float(data.get('potassium'))
        carbon = float(data.get('carbon'))
        temp = float(data.get('temp'))
        rainfall = float(data.get('rainfall'))
        texture = data.get('texture')

        rules = {
            "ph": (3.5, 9),
            "moisture": (0, 100),
            "nitrogen": (0, 140),
            "phosphorus": (0, 145),
            "potassium": (0, 205),
            "carbon": (0, 10),
            "temp": (0, 50),
            "rainfall": (0, 3000),
        }

        values = {
            "ph": ph,
            "moisture": moisture,
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
            "carbon": carbon,
            "temp": temp,
            "rainfall": rainfall,
        }

        # ✅ Range validation
        for key in values:
            min_val, max_val = rules[key]
            if values[key] < min_val or values[key] > max_val:
                return False, f"{key.upper()} must be between {min_val} and {max_val}"

        # ✅ Texture validation
        allowed_textures = ["Sandy", "Clay", "Loamy", "Silty", "Peaty"]
        if texture not in allowed_textures:
            return False, f"Texture must be one of {allowed_textures}"

        return True, values

    except Exception as e:
        return False, f"Invalid input: {str(e)}"


# ================= SOIL PREDICTION API =================
@app.route('/api/predict-soil', methods=['POST'])
def predict_soil():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data received"
            }), 400

        # ✅ Validate input
        is_valid, result = validate_inputs(data)

        if not is_valid:
            return jsonify({
                "success": False,
                "error": result
            }), 400

        values = result

        texture = data.get('texture')

        # ✅ Encode texture
        texture_encoded = texture_encoder.transform([texture])[0]

        # ✅ Prepare feature array
        features = np.array([[
            values["ph"],
            values["moisture"],
            values["nitrogen"],
            values["phosphorus"],
            values["potassium"],
            values["carbon"],
            texture_encoded,
            values["temp"],
            values["rainfall"]
        ]])

        print("📊 INPUT FEATURES:", features)

        # ✅ Predict
        prediction = model.predict(features)
        print("🔢 RAW PREDICTION:", prediction)

        # ✅ Decode
        soil_type = soil_encoder.inverse_transform(prediction)[0]
        print("🌱 FINAL SOIL TYPE:", soil_type)

        return jsonify({
            "success": True,
            "result": soil_type
        })

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7001, debug=True)