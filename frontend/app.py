import streamlit as st
import requests

st.title("🏃 Smart Running Coach")

st.header("Enter Your Details")

# -------------------------
# INPUTS
# -------------------------
age = st.number_input("Age", min_value=10, max_value=80, value=25)
gender = st.selectbox("Gender", ["Male", "Female", "Other"])

running_experience_months = st.number_input("Running Experience (months)", value=12)
previous_marathon_count = st.number_input("Previous Marathons", value=1)

training_program = st.selectbox("Training Program", ["Beginner", "Intermediate", "Other"])
motivation_level = st.slider("Motivation Level", 1, 10, 5)

personal_best_minutes = st.number_input("Personal Best (minutes)", value=240)

weekly_mileage_km = st.number_input("Weekly Mileage (km)", value=40)
runs_per_week = st.number_input("Runs per Week", value=4)
long_run_distance_km = st.number_input("Long Run Distance (km)", value=20)
training_adherence_pct = st.slider("Training Adherence (%)", 0, 100, 80)

rest_days_per_week = st.number_input("Rest Days per Week", value=2)
speed_work_sessions_per_week = st.number_input("Speed Work Sessions", value=2)
training_streak_days = st.number_input("Training Streak (days)", value=20)
missed_workout_pct = st.number_input("Missed Workout (%)", value=5.0)

vo2_max = st.number_input("VO2 Max", value=50.0)
resting_heart_rate_bpm = st.number_input("Resting Heart Rate", value=60)
recovery_score = st.number_input("Recovery Score", value=80.0)

marathon_weather = st.selectbox("Weather", ["Cool", "Hot", "Rainy", "Windy"])
course_difficulty = st.selectbox("Course Difficulty", ["Easy", "Moderate", "Hard"])

# -------------------------
# BUTTON
# -------------------------
if st.button("Predict"):

    data = {
        "age": age,
        "gender": gender,
        "running_experience_months": running_experience_months,
        "previous_marathon_count": previous_marathon_count,
        "training_program": training_program,
        "motivation_level": motivation_level,
        "personal_best_minutes": personal_best_minutes,
        "weekly_mileage_km": weekly_mileage_km,
        "runs_per_week": runs_per_week,
        "long_run_distance_km": long_run_distance_km,
        "training_adherence_pct": training_adherence_pct,
        "rest_days_per_week": rest_days_per_week,
        "speed_work_sessions_per_week": speed_work_sessions_per_week,
        "training_streak_days": training_streak_days,
        "missed_workout_pct": missed_workout_pct,
        "vo2_max": vo2_max,
        "resting_heart_rate_bpm": resting_heart_rate_bpm,
        "recovery_score": recovery_score,
        "marathon_weather": marathon_weather,
        "course_difficulty": course_difficulty
    }

    try:
        response = requests.post("http://127.0.0.1:8000/predict", json=data)
        result = response.json()

        st.success("Prediction Complete!")

        st.markdown("## 📊 Results")

        col1, col2 = st.columns(2)

        col1.metric("🏁 Predicted Time", result["formatted_time"])
        col2.metric("📈 Category", result["category"])

        st.markdown("## 💡 Suggestions")

        if result["suggestions"]:
            for s in result["suggestions"]:
                st.success(s)
        else:
            st.info("No major suggestions — you're doing great!")

        st.markdown("## 🔄 What-if Analysis")
        if result["what_if_analysis"]:
            for w in result["what_if_analysis"]:
                st.info(f"{w['change']} → {w['impact']}")
        else:
            st.warning("No major improvements detected. You're already near optimal performance!")

    except Exception as e:
        st.error("Error connecting to API")
        st.write(e)