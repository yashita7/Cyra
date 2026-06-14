import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Bell, Leaf, Search, ShoppingCart, TrendingDown } from "lucide-react";
import { buyers } from "@/data/buyers";
import { getReturn } from "@/data/returns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceRing } from "@/components/motion/ConfidenceRing";
import { RevealCard } from "@/components/motion/RevealCard";
import { ModelBadge } from "@/components/layout/ModelBadge";
import { DotBackdrop } from "@/components/layout/Backgrounds";
import { inr } from "@/lib/utils";

/** Icon mapping for buyer signals. */
const SIGNAL_ICONS: Record<string, React.ElementType> = {
  search: Search,
  cart: ShoppingCart,
  price: TrendingDown,
};

export default function Buyers() {
  const { id = "RTN-10481" } = useParams();
  const navigate = useNavigate();
  const item = getReturn(id);

  if (!item) {
    return (
      <div className="grid h-full place-items-center text-muted">
        Return {id} not found.
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8">
      <DotBackdrop />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Buyer Match · {item.sku}</p>
          <h2 className="text-[26px] font-semibold text-white">
            AI-matched buyers for {item.title}
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Instant access to demand — matched via behavioral signals
          </p>
        </div>
        <ModelBadge state="idle" label="Amazon Nova · Embeddings" />
      </div>

      {/* Tech Tag */}
      <RevealCard index={0}>
        <div className="relative mb-6 flex items-center gap-2 rounded-xl border border-sky/30 bg-sky/5 px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-sky/20">
            <span className="text-[16px]">🧠</span>
          </div>
          <span className="text-[13px] text-muted">
            Matched via{" "}
            <span className="font-semibold text-sky">
              Amazon Nova Multimodal Embeddings
            </span>{" "}
            — deep learning over search, cart, and preference signals
          </span>
        </div>
      </RevealCard>

      {/* Buyer Cards Grid */}
      <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {buyers.map((buyer, i) => {
          // Determine signal icon and type
          let SignalIcon = Search;
          if (buyer.signal.toLowerCase().includes("cart")) SignalIcon = ShoppingCart;
          else if (buyer.signal.toLowerCase().includes("price")) SignalIcon = TrendingDown;

          return (
            <RevealCard key={buyer.id} index={i + 1}>
              <div className="surface group relative overflow-hidden p-5 transition-all hover:shadow-glow">
                {/* Subtle glow effect */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

                <div className="relative">
                  {/* Match Score Ring */}
                  <div className="mb-4 flex justify-center">
                    <ConfidenceRing
                      value={buyer.matchScore}
                      size={100}
                      label="Match Score"
                      color="#00A8E1"
                    />
                  </div>

                  {/* Buyer Name */}
                  <h3 className="mb-2 text-center text-[18px] font-semibold text-white">
                    {buyer.name}
                  </h3>

                  {/* Signal */}
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-slate/40 bg-ink/40 p-3">
                    <SignalIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                    <p className="text-[12px] leading-relaxed text-muted">
                      {buyer.signal}
                    </p>
                  </div>

                  {/* Budget */}
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-[12px] text-muted">Budget</span>
                    <span className="text-[16px] font-semibold text-white">
                      {inr(buyer.budget)}
                    </span>
                  </div>

                  {/* Green Credits Badge */}
                  <div className="mb-4 rounded-lg border border-success/30 bg-success/5 p-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-success" />
                      <span className="text-[13px] font-semibold text-success">
                        Earn {buyer.greenCreditsOffered} Green Credits
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      Reward for choosing sustainable · Apply to future purchases
                    </p>
                  </div>

                  {/* Notify Button */}
                  <Button
                    className="w-full"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // In a real app, this would trigger a notification
                      console.log(`Notifying ${buyer.name} about listing`);
                    }}
                  >
                    <Bell className="h-4 w-4" />
                    Send offer with credits
                  </Button>
                </div>
              </div>
            </RevealCard>
          );
        })}
      </div>

      {/* Summary Stats */}
      <RevealCard index={4}>
        <div className="relative mt-6 grid grid-cols-3 gap-4 rounded-xl border border-slate/50 bg-squid/60 p-5">
          <div className="text-center">
            <p className="text-[24px] font-bold text-orange">{buyers.length}</p>
            <p className="text-[12px] text-muted">Matched buyers</p>
          </div>
          <div className="border-l border-r border-slate/50 text-center">
            <p className="text-[24px] font-bold text-success">
              {Math.round(buyers.reduce((sum, b) => sum + b.matchScore, 0) / buyers.length)}%
            </p>
            <p className="text-[12px] text-muted">Avg. match score</p>
          </div>
          <div className="text-center">
            <p className="text-[24px] font-bold text-gold">
              {buyers.reduce((sum, b) => sum + b.greenCreditsOffered, 0)}
            </p>
            <p className="text-[12px] text-muted">Total Green Credits</p>
          </div>
        </div>
      </RevealCard>

      {/* CTA */}
      <RevealCard index={5}>
        <div className="mt-6">
          <Button
            size="lg"
            className="group w-full"
            onClick={() => navigate("/prevention")}
          >
            View prevention insights
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </RevealCard>
    </div>
  );
}
