import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";

interface Props {
  suggestions: string[];
}

export default function Suggestions({ suggestions }: Props) {
  if (!suggestions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-strong rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/5"
    >
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground text-lg">Suggestions</h3>
      </div>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-muted/50 rounded-xl px-4 py-3"
          >
            <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span className="text-foreground text-sm">{s}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
