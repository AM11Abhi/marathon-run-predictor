import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface Props {
  insights: string;
}

export default function Insights({ insights }: Props) {
  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-strong rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="coach-gradient p-2 rounded-lg">
          <MessageCircle className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-display font-semibold text-foreground text-lg">Coach's Insight</h3>
      </div>
      <div className="bg-muted/50 rounded-xl p-5 border-l-4 border-primary">
        <p className="text-foreground text-sm leading-relaxed italic">{insights}</p>
      </div>
    </motion.div>
  );
}
