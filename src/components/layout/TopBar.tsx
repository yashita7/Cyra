import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const TITLES: { match: (p: string) => boolean; title: string; crumb?: string }[] = [
  { match: (p) => p === "/inbox", title: "Returns Inbox", crumb: "Console" },
  { match: (p) => p.startsWith("/grade"), title: "Live Grading", crumb: "Console › Inbox" },
  { match: (p) => p.startsWith("/decision"), title: "Decision Theater", crumb: "Console › Grading" },
  { match: (p) => p.startsWith("/listing"), title: "Auto-Listing + Passport", crumb: "Console › Decision" },
  { match: (p) => p.startsWith("/buyers"), title: "Buyer Match", crumb: "Console › Listing" },
  { match: (p) => p === "/prevention", title: "Prevention Dashboard", crumb: "Console" },
  { match: (p) => p === "/impact", title: "Impact Dashboard", crumb: "Console" },
  { match: (p) => p === "/_kit", title: "Motion Kit", crumb: "Dev" },
];

export function TopBar() {
  const { pathname } = useLocation();
  const entry = TITLES.find((t) => t.match(pathname));
  const title = entry?.title ?? "Cyra Console";

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-slate/50 bg-squid/70 px-5 backdrop-blur-md">
      <div className="flex flex-col">
        {entry?.crumb && (
          <span className="text-[10px] uppercase tracking-wider text-muted/50">
            {entry.crumb}
          </span>
        )}
        <h1 className="text-[15px] font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-slate/60 bg-ink/50 px-3 py-1.5 text-sm text-muted/60 lg:flex">
          <Search className="h-3.5 w-3.5" />
          <span>Search returns, SKUs…</span>
          <kbd className="ml-2 rounded border border-slate/60 px-1.5 text-[10px]">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate/60 bg-ink/40 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[12px] font-medium text-muted">
            Returns stream: <span className="text-white">active</span>
          </span>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange to-gold text-[13px] font-bold text-ink">
          OC
        </div>
      </div>
    </header>
  );
}
