import { motion } from "framer-motion";
import { Timer, Award } from "lucide-react";

interface Props {
  predictedTime: number;
  formattedTime: string;
  category: string;
}

export default function ResultCard({ formattedTime, category }: Props) {
  const categoryColor: Record<string, string> = {
    Beginner: "bg-secondary text-secondary-foreground",
    Intermediate: "bg-primary/20 text-accent",
    Advanced: "bg-accent/20 text-accent",
    Elite: "coach-gradient text-primary-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-strong rounded-2xl p-8 shadow-xl shadow-primary/5 text-center"
    >
      <div className="inline-flex items-center justify-center coach-gradient rounded-full p-4 mb-4">
        <Timer className="w-8 h-8 text-primary-foreground" />
      </div>
      <p className="text-sm text-muted-foreground font-medium mb-1">Predicted Marathon Time</p>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
        {formattedTime}
      </h2>
      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${categoryColor[category] || "bg-muted text-muted-foreground"}`}>
        <Award className="w-4 h-4" />
        {category}
      </span>
    </motion.div>
  );
}
