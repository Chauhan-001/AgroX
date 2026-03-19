from flask import Flask, render_template, request
import numpy as np
import joblib

app = Flask(__name__)

# Load models
model = joblib.load("soil_prediction_model.pkl")
texture_encoder = joblib.load("texture_encoder.pkl")
soil_encoder = joblib.load("soil_encoder.pkl")

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        ph = float(request.form['ph'])
        moisture = float(request.form['moisture'])
        nitrogen = float(request.form['nitrogen'])
        phosphorus = float(request.form['phosphorus'])
        potassium = float(request.form['potassium'])
        carbon = float(request.form['carbon'])
        texture = request.form['texture']
        temp = float(request.form['temp'])
        rainfall = float(request.form['rainfall'])

        # Encode texture
        texture_encoded = texture_encoder.transform([texture])[0]
        features = np.array([[ph, moisture, nitrogen, phosphorus,potassium, carbon, texture_encoded,temp, rainfall]])
        prediction = model.predict(features)
        soil_type = soil_encoder.inverse_transform(prediction)[0]
        return render_template("result.html", result=soil_type)

    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    app.run(debug=True)