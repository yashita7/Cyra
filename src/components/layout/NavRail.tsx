import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Inbox,
  GitBranch,
  Tag,
  Users,
  ShieldCheck,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CyraMark } from "./CyraMark";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/decision/RTN-10481", label: "Decision", icon: GitBranch },
  { to: "/listing/RTN-10481", label: "Listings", icon: Tag },
  { to: "/buyers/RTN-10481", label: "Buyers", icon: Users },
  { to: "/prevention", label: "Prevention", icon: ShieldCheck },
  { to: "/impact", label: "Impact", icon: Leaf },
];

export function NavRail() {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-slate/50 bg-squid/80 backdrop-blur md:flex">
      <div className="flex h-[56px] items-center gap-2.5 px-5">
        <CyraMark className="h-7 w-7" />
        <span className="text-[20px] font-bold tracking-tight text-orange">
          Cyra
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="section-label mb-2 px-3">Console</p>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-orange/10 text-orange"
                  : "text-muted hover:bg-white/5 hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-orange"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4">
        <div className="flex items-center gap-2 rounded-lg border border-slate/50 bg-ink/40 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
          <span className="mono text-[10px] text-muted/70">
            All systems operational
          </span>
        </div>
      </div>
    </aside>
  );
}
