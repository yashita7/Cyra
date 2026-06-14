import { StubScreen } from "./_StubScreen";

export default function Prevention() {
  return (
    <StubScreen
      title="Prevention Dashboard"
      description="Feed return reasons upstream to prevent the next return — the loop that makes returns intelligence compounding."
      showModelBadge
      notes={[
        "Reason clusters for flagged SKUs (prevention.ts: SKU-4471, 22% return rate).",
        "Top reason: 61% “smaller than expected”.",
        "Before/after listing fix (true-to-size → runs small, order up).",
        "−38% projected reduction gauge (reuse ConfidenceRing / AnimatedNumber).",
      ]}
    />
  );
}
