from pydantic import BaseModel

class RunnerInput(BaseModel):
    # Basic
    age: int
    gender: str
    running_experience_months: int
    previous_marathon_count: int
    training_program: str
    motivation_level: int
    personal_best_minutes: float
    

    # Training
    weekly_mileage_km: float
    runs_per_week: int
    long_run_distance_km: float
    training_adherence_pct: int

    # Additional training
    rest_days_per_week: int
    speed_work_sessions_per_week: int
    training_streak_days: int
    missed_workout_pct: float

    # Physiological
    vo2_max: float
    resting_heart_rate_bpm: int
    recovery_score: float

    # Race day
    marathon_weather: str
    course_difficulty: str