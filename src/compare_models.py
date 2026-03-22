import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor

from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


# Load data
df = pd.read_csv("data/train.csv")

# -----------------------------
# FEATURE ENGINEERING
# -----------------------------
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


# -----------------------------
# FEATURES (UPDATED)
# -----------------------------
features = [
    "age",
    "gender",
    "running_experience_months",
    "previous_marathon_count",
    "training_program",
    "motivation_level",
    "personal_best_minutes",
    "weekly_mileage_km",
    "runs_per_week",
    "long_run_distance_km",
    "training_adherence_pct",

    "rest_days_per_week",
    "speed_work_sessions_per_week",
    "training_streak_days",
    "missed_workout_pct",

    "vo2_max",
    "resting_heart_rate_bpm",
    "recovery_score",

    "marathon_weather",
    "course_difficulty",

    # engineered
    "training_load",
    "aerobic_efficiency",
    "speed_ratio",
    "consistency_score"
]

target = "actual_finish_time_minutes"

df = df[features + [target]]

# Handle missing
df = df.dropna(subset=[target])
df.fillna(df.median(numeric_only=True), inplace=True)

X = df[features]
y = df[target]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Preprocessing
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
# MODELS (UPDATED)
# -----------------------------
models = {
    "Linear Regression": LinearRegression(),
    
    "Random Forest": RandomForestRegressor(
        n_estimators=100, random_state=42
    ),
    
    "Gradient Boosting": GradientBoostingRegressor(
        random_state=42
    ),

    "LightGBM": LGBMRegressor(
        n_estimators=300,
        learning_rate=0.05,
        random_state=42
    ),

    "CatBoost": CatBoostRegressor(
        iterations=300,
        learning_rate=0.05,
        depth=6,
        verbose=0
    )
}

# -----------------------------
# EVALUATION
# -----------------------------
print("\n📊 Model Comparison:\n")

for name, model in models.items():
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ])
    
    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    
    print(f"{name}")
    print(f"MAE  : {mae:.2f}")
    print(f"RMSE : {rmse:.2f}")
    print(f"R²   : {r2:.4f}")
    print("-" * 30)