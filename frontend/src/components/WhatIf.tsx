import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";

interface WhatIfItem {
  change: string;
  impact: string;
}

interface Props {
  items: WhatIfItem[];
}

export default function WhatIf({ items }: Props) {
  if (!items.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-strong rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/5"
    >
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground text-lg">What-If Analysis</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-4 hover:border-primary/40 transition-colors duration-200"
          >
            <p className="text-sm text-foreground font-medium mb-2">{item.change}</p>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-semibold text-primary">{item.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
