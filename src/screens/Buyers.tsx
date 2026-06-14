import { useParams } from "react-router-dom";
import { StubScreen } from "./_StubScreen";

export default function Buyers() {
  const { id = "RTN-10481" } = useParams();
  return (
    <StubScreen
      title="Buyer Match"
      description="Match the listing to high-intent buyers and offer Green Credits for choosing the second-life option."
      backTo={{ label: "Back to listing", to: `/listing/${id}` }}
      notes={[
        "3 buyer cards from buyers.ts (match scores 94 / 88 / 81) — reuse ConfidenceRing for the score.",
        "Each buyer: intent signal, budget, and Green Credits offered (~120).",
        "Highlight best match; CTA to notify / reserve.",
        "Reuse RevealCard grid + StatusPill.",
      ]}
    />
  );
}
