import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footprints } from "lucide-react";
import RunnerForm, { type RunnerData } from "@/components/RunnerForm";
import ResultCard from "@/components/ResultCard";
import Suggestions from "@/components/Suggestions";
import WhatIf from "@/components/WhatIf";
import Insights from "@/components/Insights";

interface PredictionResult {
  predicted_time_minutes: number;
  formatted_time: string;
  category: string;
  suggestions: string[];
  what_if_analysis: { change: string; impact: string }[];
  ai_insights: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/predict";

export default function Index() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (data: RunnerData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const json: PredictionResult = await res.json();
      setResult(json);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/20 blur-[100px] animate-pulse-soft [animation-delay:1s]" />
        <div className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-accent/8 blur-[80px] animate-pulse-soft [animation-delay:2s]" />
      </div>

      {/* Glassmorphism navbar */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 pt-3">
          <div className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-primary/5">
            <div className="flex items-center gap-3">
              <div className="coach-gradient p-2 rounded-xl shadow-md shadow-primary/20">
                <Footprints className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="font-display font-bold text-base text-foreground tracking-tight">
                Smart Running Coach
              </h1>
            </div>
            <span className="hidden sm:block text-xs text-muted-foreground font-medium">
              AI-powered marathon prediction
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 md:py-14 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 mb-2"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Predict Your Marathon Time
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Enter your training data and let our ML model predict your finish time with personalized coaching insights.
          </p>
        </motion.div>

        <RunnerForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive p-4 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <div ref={resultsRef} className="space-y-6">
              <ResultCard
                predictedTime={result.predicted_time_minutes}
                formattedTime={result.formatted_time}
                category={result.category}
              />
              <Insights insights={result.ai_insights} />
              <Suggestions suggestions={result.suggestions} />
              <WhatIf items={result.what_if_analysis} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-8 text-center text-xs text-muted-foreground">
        Smart Running Coach &middot; Powered by Machine Learning
      </footer>
    </div>
  );
}
