import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import numpy as np

# Load data
df = pd.read_csv("data/train.csv")

# FEATURE ENGINEERING (same as training)

df["training_load"] = (
    df["weekly_mileage_km"] * df["runs_per_week"]
) / (df["rest_days_per_week"] + 1)

df["aerobic_efficiency"] = (
    df["vo2_max"] / df["resting_heart_rate_bpm"]
)

df["speed_ratio"] = (
    df["speed_work_sessions_per_week"] / (df["runs_per_week"] + 1)
)

df["consistency_score"] = (
    df["training_adherence_pct"] * df["training_streak_days"]
) / (1 + df["missed_workout_pct"])

# Same features as training
features = [
    "age",
    "gender",
    "running_experience_months",
    "previous_marathon_count",
    "training_program",
    "motivation_level",
    "weekly_mileage_km",
    "runs_per_week",
    "long_run_distance_km",
    "training_adherence_pct",
    "personal_best_minutes",

    # NEW STRONG FEATURES
    "rest_days_per_week",
    "speed_work_sessions_per_week",
    "training_streak_days",
    "missed_workout_pct",

    # PHYSIOLOGICAL FEATURES
    "vo2_max",
    "resting_heart_rate_bpm",
    "recovery_score",

    # RACE DAY FEATURES
    "marathon_weather",
    "course_difficulty",
    
    # ENGINEERED FEATURES
    "training_load",
    "aerobic_efficiency",
    "speed_ratio",
    "consistency_score"
]

target = "actual_finish_time_minutes"

# Keep required columns
df = df[features + [target]]

# Handle missing values
df = df.dropna(subset=[target])
df.fillna(df.median(numeric_only=True), inplace=True)

# Split
X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Load trained model
model = joblib.load("model/model.pkl")

# Predict
preds = model.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, preds)
rmse = np.sqrt(mean_squared_error(y_test, preds))
r2 = r2_score(y_test, preds)

# Print results
print("\n📊 Model Evaluation Results:")
print(f"MAE  : {mae:.2f} minutes")
print(f"RMSE : {rmse:.2f} minutes")
print(f"R²   : {r2:.4f}")