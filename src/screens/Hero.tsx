import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeamsBackground } from "@/components/layout/Backgrounds";
import { CyraMark } from "@/components/layout/CyraMark";

const HEADLINE = ["Give every return,", "its best second life."];

export default function Hero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const word = {
    hidden: { opacity: 0, y: reduce ? 0 : 28, filter: "blur(8px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6">
      <BeamsBackground />

      {/* wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-8 flex items-center gap-2.5"
      >
        <CyraMark className="h-9 w-9" />
        <span className="text-[26px] font-bold tracking-tight text-orange">
          Cyra
        </span>
      </motion.div>

      {/* kinetic headline */}
      <h1
        aria-label={`${HEADLINE[0]} ${HEADLINE[1]}`}
        className="relative z-10 max-w-4xl text-center text-[44px] font-bold leading-[1.05] tracking-tight md:text-[68px]"
      >
        {HEADLINE.map((line, li) => (
          <span key={li} className="block">
            {line.split(" ").map((w, wi) => {
              const idx = li * 4 + wi;
              const isAccent = line === HEADLINE[1];
              return (
                <motion.span
                  key={wi}
                  custom={idx}
                  variants={word}
                  initial="hidden"
                  animate="show"
                  className={`mr-[0.25em] inline-block ${
                    isAccent ? "text-gradient-orange" : "text-white"
                  }`}
                >
                  {w}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>

      {/* subline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative z-10 mt-6 max-w-xl text-center text-[16px] text-muted md:text-[18px]"
      >
        Autonomous returns intelligence — grade, route, list, and prevent, in
        seconds.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        className="relative z-10 mt-9"
      >
        <Button size="lg" onClick={() => navigate("/inbox")} className="group">
          Open Console
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  );
}
