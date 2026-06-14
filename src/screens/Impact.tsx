import { StubScreen } from "./_StubScreen";

export default function Impact() {
  return (
    <StubScreen
      title="Impact Dashboard"
      description="Value recovered, carbon diverted, and what it looks like projected to Amazon scale."
      notes={[
        "Count-up counters from stats.ts (₹4.2L recovered, 1,043 kg CO₂e, 58% preventable, 96/100 units).",
        "“Project to Amazon scale” toggle → $2B+ / 1M+ tonnes (reuse AnimatedNumber re-animation).",
        "Climate Pledge framing.",
        "recharts trend lines (Person 2).",
      ]}
    />
  );
}
