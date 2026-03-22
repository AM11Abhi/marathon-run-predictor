from fastapi import FastAPI
from backend.schemas import RunnerInput
from src.predict import predict_runner, what_if_analysis
from src.llm_insights import generate_insights
app = FastAPI()

def format_time(minutes):
    hours = int(minutes // 60)
    mins = int(minutes % 60)
    return f"{hours} hr {mins} min"

def get_category(minutes):
    if minutes < 180:
        return "Elite"
    elif minutes < 240:
        return "Advanced"
    elif minutes < 300:
        return "Intermediate"
    else:
        return "Beginner"


def get_suggestions(data):
    suggestions = []

    if data["weekly_mileage_km"] < 40:
        suggestions.append("Increase weekly mileage for better endurance")

    if data["training_adherence_pct"] < 85:
        suggestions.append("Improve training consistency")

    if data["runs_per_week"] < 4:
        suggestions.append("Increase number of runs per week")

    if data["running_experience_months"] < 6:
        suggestions.append("Gain more running experience gradually")

    if not suggestions:
        suggestions.append("Great job! Keep maintaining your training")

    return suggestions


@app.get("/")
def home():
    return {"message": "Smart Running Coach API is running 🚀"}

@app.post("/predict")
def predict(data: RunnerInput):
    input_data = data.dict()

    result = predict_runner(input_data)
    insights = generate_insights(input_data, result, what_if_analysis(input_data))


    return {
        "predicted_time_minutes": round(result, 2),
        "formatted_time": format_time(result),
        "category": get_category(result),
        "suggestions": get_suggestions(input_data),
        "what_if_analysis": what_if_analysis(input_data),
        "ai_insights": insights
    }