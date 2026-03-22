import joblib
import pandas as pd

# Load model (only once)
model = joblib.load("model/model.pkl")

def predict_runner(data: dict):
    """
    data: dictionary of user input
    """

    df = pd.DataFrame([data])

    # -----------------------------
    # FEATURE ENGINEERING (IMPORTANT)
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
    # PREDICT
    # -----------------------------
    prediction = model.predict(df)[0]

    return prediction


def format_impact(minutes):
    if minutes <= 1:
        return None
    return f"~{int(round(minutes))} min faster"


def what_if_analysis(data: dict):
    base_time = predict_runner(data)

    scenarios = []

    tests = [
        ("Increase weekly mileage by 10 km", {"weekly_mileage_km": data["weekly_mileage_km"] + 10}),
        ("Improve training adherence by 10%", {"training_adherence_pct": min(100, data["training_adherence_pct"] + 10)}),
        ("Increase runs per week by 1", {"runs_per_week": data["runs_per_week"] + 1}),
        ("Increase long run distance by 5 km", {"long_run_distance_km": data["long_run_distance_km"] + 5})
    ]

    for change_text, updates in tests:
        new_data = data.copy()
        new_data.update(updates)

        new_time = predict_runner(new_data)
        impact = base_time - new_time

        formatted = format_impact(impact)

        if formatted:
            scenarios.append({
                "change": change_text,
                "impact": formatted,
                "impact_value": impact
            })

    # sort by best improvement
    scenarios.sort(key=lambda x: x["impact_value"], reverse=True)

    # keep top 3
    scenarios = scenarios[:3]

    # remove internal field
    for s in scenarios:
        del s["impact_value"]

    return scenarios
    """
    Simulate improvements by tweaking key features
    """
    base_time = predict_runner(data)

    scenarios = []

    # 1. Increase mileage
    new_data = data.copy()
    new_data["weekly_mileage_km"] += 10
    new_time = predict_runner(new_data)
    scenarios.append({
        "change": "Increase weekly mileage by 10 km",
        "impact_minutes": round(base_time - new_time, 2)
    })

    # 2. Improve consistency
    new_data = data.copy()
    new_data["training_adherence_pct"] = min(100, data["training_adherence_pct"] + 10)
    new_time = predict_runner(new_data)
    scenarios.append({
        "change": "Improve training adherence by 10%",
        "impact_minutes": round(base_time - new_time, 2)
    })

    # 3. Increase runs per week
    new_data = data.copy()
    new_data["runs_per_week"] += 1
    new_time = predict_runner(new_data)
    scenarios.append({
        "change": "Increase runs per week by 1",
        "impact_minutes": round(base_time - new_time, 2)
    })

    # 4. Increase long run distance
    new_data = data.copy()
    new_data["long_run_distance_km"] += 5
    new_time = predict_runner(new_data)
    scenarios.append({
        "change": "Increase long run distance by 5 km",
        "impact_minutes": round(base_time - new_time, 2)
    })

    return scenarios

# -----------------------------
# TEST (run this file directly)
# -----------------------------
if __name__ == "__main__":
    
    sample_input = {
    "age": 25,
    "gender": "Male",
    "running_experience_months": 12,
    "previous_marathon_count": 2,
    "training_program": "Intermediate",
    "motivation_level": 7,
    "personal_best_minutes": 240,

    "weekly_mileage_km": 40,
    "runs_per_week": 4,
    "long_run_distance_km": 18,
    "training_adherence_pct": 80,

    "rest_days_per_week": 2,
    "speed_work_sessions_per_week": 2,
    "training_streak_days": 20,
    "missed_workout_pct": 5.0,

    "vo2_max": 50.0,
    "resting_heart_rate_bpm": 60,
    "recovery_score": 80.0,

    "marathon_weather": "Cool",
    "course_difficulty": "Moderate"
}

    result = predict_runner(sample_input)

    print(f"Predicted Time: {result:.2f} minutes")