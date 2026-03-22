import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Load data
df = pd.read_csv("data/train.csv")

# -----------------------------
# FEATURE ENGINEERING
# -----------------------------

# Training Load
df["training_load"] = (
    df["weekly_mileage_km"] * df["runs_per_week"]
) / (df["rest_days_per_week"] + 1)

# Aerobic Efficiency
df["aerobic_efficiency"] = (
    df["vo2_max"] / df["resting_heart_rate_bpm"]
)

# Speed Work Ratio
df["speed_ratio"] = (
    df["speed_work_sessions_per_week"] / (df["runs_per_week"] + 1)
)

# Consistency Score
df["consistency_score"] = (
    df["training_adherence_pct"] * df["training_streak_days"]
) / (1 + df["missed_workout_pct"])

# -----------------------------
# SELECT FEATURES (IMPORTANT)
# -----------------------------
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

# Keep only required columns
df = df[features + [target]]

# -----------------------------
# HANDLE MISSING VALUES
# -----------------------------
# Drop rows where target is missing
df = df.dropna(subset=[target])

# Fill remaining missing numeric values with median
df.fillna(df.median(numeric_only=True), inplace=True)

# -----------------------------
# SPLIT DATA
# -----------------------------
X = df[features]
y = df[target]

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# PREPROCESSING
# -----------------------------
categorical_cols = [
    "gender",
    "training_program",
    "marathon_weather",
    "course_difficulty"
]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ],
    remainder="passthrough"
)

# -----------------------------
# MODEL PIPELINE
# -----------------------------
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    depth=6,
    verbose=0
))
])

# -----------------------------
# TRAIN MODEL
# -----------------------------
model.fit(X_train, y_train)

# -----------------------------
# EVALUATE
# -----------------------------
preds = model.predict(X_val)
mae = mean_absolute_error(y_val, preds)

print(f"MAE: {mae:.2f} minutes")

# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(model, "model/model.pkl")

print("Model saved successfully!")