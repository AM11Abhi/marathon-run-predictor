import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";

export interface RunnerData {
  age: number;
  gender: string;
  running_experience_months: number;
  previous_marathon_count: number;
  training_program: string;
  motivation_level: number;
  personal_best_minutes: number;
  weekly_mileage_km: number;
  runs_per_week: number;
  long_run_distance_km: number;
  training_adherence_pct: number;
  rest_days_per_week: number;
  speed_work_sessions_per_week: number;
  training_streak_days: number;
  missed_workout_pct: number;
  vo2_max: number;
  resting_heart_rate_bpm: number;
  recovery_score: number;
  marathon_weather: string;
  course_difficulty: string;
}

const FITNESS_MAP: Record<string, number> = {
  Beginner: 300,
  Intermediate: 260,
  Advanced: 220,
};

const defaultData: RunnerData = {
  age: 30,
  gender: "Male",
  running_experience_months: 24,
  previous_marathon_count: 1,
  training_program: "Intermediate",
  motivation_level: 7,
  personal_best_minutes: 270,
  weekly_mileage_km: 40,
  runs_per_week: 4,
  long_run_distance_km: 25,
  training_adherence_pct: 80,
  rest_days_per_week: 2,
  speed_work_sessions_per_week: 1,
  training_streak_days: 30,
  missed_workout_pct: 10,
  vo2_max: 45,
  resting_heart_rate_bpm: 60,
  recovery_score: 75,
  marathon_weather: "Cool",
  course_difficulty: "Moderate",
};

interface Props {
  onSubmit: (data: RunnerData) => void;
  isLoading: boolean;
}

const inputClass =
  "w-full h-12 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all duration-200 hover:border-primary/20 text-sm";
const labelClass = "block text-sm font-medium text-muted-foreground mb-1.5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function RunnerForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<RunnerData>(defaultData);
  const [hasRunMarathon, setHasRunMarathon] = useState(true);
  const [fitnessLevel, setFitnessLevel] = useState("Intermediate");

  const set = <K extends keyof RunnerData>(key: K, value: RunnerData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!hasRunMarathon) {
      payload.personal_best_minutes = FITNESS_MAP[fitnessLevel];
    }
    if (payload.personal_best_minutes <= 0) {
      payload.personal_best_minutes = FITNESS_MAP["Intermediate"];
    }
    onSubmit(payload);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/5 space-y-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="coach-gradient p-2.5 rounded-xl">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-display font-semibold text-foreground">
          Runner Profile
        </h2>
      </div>

      {/* Personal Info */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-display font-semibold text-accent uppercase tracking-wider mb-1">
          Personal Info
        </legend>
        {/* Row 1: Age / Gender / Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Age">
            <input type="number" min={10} max={90} className={inputClass} value={form.age} onChange={(e) => set("age", +e.target.value)} />
          </Field>
          <Field label="Gender">
            <select className={inputClass} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Experience (months)">
            <input type="number" min={0} className={inputClass} value={form.running_experience_months} onChange={(e) => set("running_experience_months", +e.target.value)} />
          </Field>
        </div>

        {/* Row 2: Previous Marathons / Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Previous Marathons">
            <input type="number" min={0} className={inputClass} value={form.previous_marathon_count} onChange={(e) => set("previous_marathon_count", +e.target.value)} />
          </Field>
          <div className="sm:col-span-2 space-y-1.5">
            <label className={labelClass}>Have you run a marathon before?</label>
            <div className="flex h-12 rounded-xl border border-border/60 overflow-hidden">
              {["Yes", "No"].map((opt) => {
                const active = opt === "Yes" ? hasRunMarathon : !hasRunMarathon;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHasRunMarathon(opt === "Yes")}
                    className={`flex-1 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "coach-gradient text-primary-foreground"
                        : "bg-card/50 text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: PB or Fitness Level — full width */}
        <AnimatePresence mode="wait">
          {hasRunMarathon ? (
            <motion.div
              key="pb"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4">
                <Field label="Personal Best (min)">
                  <input type="number" min={60} className={inputClass} value={form.personal_best_minutes} onChange={(e) => set("personal_best_minutes", +e.target.value)} />
                </Field>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fitness"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4">
                <Field label="Select your fitness level">
                  <select className={inputClass} value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </Field>
                <p className="text-xs text-muted-foreground -mt-2">
                  Estimated PB: {FITNESS_MAP[fitnessLevel]} min
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </fieldset>

      {/* Training */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-display font-semibold text-accent uppercase tracking-wider mb-1">
          Training Details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Training Program">
            <select className={inputClass} value={form.training_program} onChange={(e) => set("training_program", e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Elite</option>
            </select>
          </Field>
          <Field label="Weekly Mileage (km)">
            <input type="number" min={0} className={inputClass} value={form.weekly_mileage_km} onChange={(e) => set("weekly_mileage_km", +e.target.value)} />
          </Field>
          <Field label="Runs / Week">
            <input type="number" min={0} max={14} className={inputClass} value={form.runs_per_week} onChange={(e) => set("runs_per_week", +e.target.value)} />
          </Field>
          <Field label="Long Run Distance (km)">
            <input type="number" min={0} className={inputClass} value={form.long_run_distance_km} onChange={(e) => set("long_run_distance_km", +e.target.value)} />
          </Field>
          <Field label="Training Adherence (%)">
            <input type="number" min={0} max={100} className={inputClass} value={form.training_adherence_pct} onChange={(e) => set("training_adherence_pct", +e.target.value)} />
          </Field>
          <Field label="Rest Days / Week">
            <input type="number" min={0} max={7} className={inputClass} value={form.rest_days_per_week} onChange={(e) => set("rest_days_per_week", +e.target.value)} />
          </Field>
          <Field label="Speed Work Sessions / Week">
            <input type="number" min={0} className={inputClass} value={form.speed_work_sessions_per_week} onChange={(e) => set("speed_work_sessions_per_week", +e.target.value)} />
          </Field>
          <Field label="Training Streak (days)">
            <input type="number" min={0} className={inputClass} value={form.training_streak_days} onChange={(e) => set("training_streak_days", +e.target.value)} />
          </Field>
          <Field label="Missed Workouts (%)">
            <input type="number" min={0} max={100} className={inputClass} value={form.missed_workout_pct} onChange={(e) => set("missed_workout_pct", +e.target.value)} />
          </Field>
        </div>

        {/* Motivation Slider */}
        <div className="space-y-1.5">
          <label className={labelClass}>
            Motivation Level: <span className="font-semibold text-foreground">{form.motivation_level}/10</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.motivation_level}
            onChange={(e) => set("motivation_level", +e.target.value)}
            className="w-full accent-primary h-2 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </fieldset>

      {/* Health Metrics */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-display font-semibold text-accent uppercase tracking-wider mb-1">
          Health & Recovery
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="VO2 Max">
            <input type="number" min={20} max={90} className={inputClass} value={form.vo2_max} onChange={(e) => set("vo2_max", +e.target.value)} />
          </Field>
          <Field label="Resting Heart Rate (bpm)">
            <input type="number" min={30} max={120} className={inputClass} value={form.resting_heart_rate_bpm} onChange={(e) => set("resting_heart_rate_bpm", +e.target.value)} />
          </Field>
          <Field label="Recovery Score">
            <input type="number" min={0} max={100} className={inputClass} value={form.recovery_score} onChange={(e) => set("recovery_score", +e.target.value)} />
          </Field>
        </div>
      </fieldset>

      {/* Race Conditions */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-display font-semibold text-accent uppercase tracking-wider mb-1">
          Race Conditions
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Marathon Weather">
            <select className={inputClass} value={form.marathon_weather} onChange={(e) => set("marathon_weather", e.target.value)}>
              <option>Cool</option>
              <option>Moderate</option>
              <option>Hot</option>
              <option>Cold</option>
              <option>Rainy</option>
            </select>
          </Field>
          <Field label="Course Difficulty">
            <select className={inputClass} value={form.course_difficulty} onChange={(e) => set("course_difficulty", e.target.value)}>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Hilly</option>
              <option>Challenging</option>
            </select>
          </Field>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full coach-gradient text-primary-foreground font-display font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 disabled:opacity-60 flex items-center justify-center gap-2 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Activity className="w-5 h-5" />
            Predict My Marathon Time
          </>
        )}
      </button>
    </motion.form>
  );
}
