import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";

/** Renders the active child route with a crossfade between interior screens. */
export function ShellOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>{outlet}</PageTransition>
    </AnimatePresence>
  );
}
