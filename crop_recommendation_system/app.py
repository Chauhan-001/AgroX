from flask import Flask, render_template, request
import pandas as pd
import pickle

app = Flask(__name__)

# Load models and encoders
encoder = pickle.load(open("models/encoder.pkl", 'rb'))
scaler = pickle.load(open("models/scaler.pkl", 'rb'))
model_gbc = pickle.load(open("models/model_gbc.pkl", 'rb'))

# Prediction function
def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_df = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]],
                            columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    input_scaled = scaler.transform(input_df)
    prediction_encoded = model_gbc.predict(input_scaled)
    prediction = encoder.inverse_transform(prediction_encoded)
    return prediction[0]

@app.route('/')
def home():
    return render_template('index.html')

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

        crop = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
        return render_template('result.html', crop=crop)

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
