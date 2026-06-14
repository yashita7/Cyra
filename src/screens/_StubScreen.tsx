import { Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelBadge } from "@/components/layout/ModelBadge";
import { DotBackdrop } from "@/components/layout/Backgrounds";

interface StubScreenProps {
  title: string;
  description: string;
  notes: string[];
  showModelBadge?: boolean;
  backTo?: { label: string; to: string };
}

/** Clean placeholder for Person 2's screens — working route + nav, no logic. */
export function StubScreen({
  title,
  description,
  notes,
  showModelBadge = false,
  backTo,
}: StubScreenProps) {
  return (
    <div className="relative mx-auto max-w-5xl px-6 py-10">
      <DotBackdrop />
      <div className="relative">
        {/* TODO(Person 2): build this screen per docs/05_HANDOFF.md */}
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="gold">
            <Construction className="h-3 w-3" />
            Coming soon
          </Badge>
          {showModelBadge && <ModelBadge state="idle" />}
        </div>

        <h2 className="text-[30px] font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">{description}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {notes.map((n, i) => (
            <div
              key={i}
              className="rounded-xl border border-dashed border-slate/60 bg-squid/40 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-orange/10 text-[11px] font-bold text-orange">
                  {i + 1}
                </span>
                <span className="section-label">On the roadmap</span>
              </div>
              <p className="text-[13px] text-muted">{n}</p>
            </div>
          ))}
        </div>

        {backTo && (
          <div className="mt-6">
            <Button asChild variant="secondary">
              <Link to={backTo.to}>
                <ArrowLeft className="h-4 w-4" />
                {backTo.label}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
