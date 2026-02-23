# 🌾 Crop Recommendation System using Machine Learning

This project predicts the **most suitable crop** to grow based on soil and weather conditions using **Machine Learning**.  
It features an **interactive Flask web application** where users can input soil nutrients and environmental parameters to get instant recommendations.

---

## 🧠 Project Overview
Farmers often face difficulty choosing the right crop for their field due to changing weather and soil conditions.  
This project uses **N, P, K values, Temperature, Humidity, pH, and Rainfall** as input to predict the best crop using a trained **Gradient Boosting Classifier (GBC)** model.

---

## ⚙️ Technologies Used
- **Programming Language:** Python  
- **Framework:** Flask  
- **Libraries:**
  - pandas  
  - numpy  
  - scikit-learn  
  - gunicorn  
  - joblib / pickle (for model serialization)

---

## 🧩 Files and Structure

├── app.py # Main Flask app
├── models/
│ ├── encoder.pkl
│ ├── scaler.pkl
│ └── model_gbc.pkl
├── templates/
│ ├── index.html # Input form page
│ └── result.html # Output result page
├── requirements.txt # Dependencies
└── README.md # Documentation


---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/shekhar-commit/crop_recommendation_system.git
cd crop_recommendation_system

2️⃣ Install Dependencies
pip install -r requirements.txt

3️⃣ Run the Flask App
python app.py

4️⃣ Open in Browser

Go to:

http://127.0.0.1:5000