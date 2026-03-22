# 🏃 Smart Running Coach

A Machine Learning-based system that predicts marathon finish time and provides personalized training insights.

---

## 🚀 Features

- Predict marathon finish time
- Categorize runner performance
- Suggest improvements
- What-if simulator for training changes
- Streamlit UI for interaction

---

## 🧠 Model

- Algorithm: CatBoost Regressor
- MAE: ~11.7 minutes
- Features: training, physiological, race conditions + personal best

---

## ⚙️ Tech Stack

- Python
- FastAPI
- CatBoost
- Streamlit

---

## ▶️ Run Locally

### 1. Install dependencies
```bash
pip install -r requirements.txt
2. Start backend
uvicorn backend.main:app --reload
3. Run frontend
streamlit run frontend/app.py
💡 Example Output
Predicted Time: 4 hr 30 min
Suggestions: Improve consistency
What-if: +10% adherence → ~7 min faster