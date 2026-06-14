import { useParams } from "react-router-dom";
import { StubScreen } from "./_StubScreen";

export default function Listing() {
  const { id = "RTN-10481" } = useParams();
  return (
    <StubScreen
      title="Auto-Listing + Product Passport"
      description="Generated resale listing with a verified condition passport — the trustworthy refurbished experience for the buyer."
      showModelBadge
      backTo={{ label: "Back to decision", to: `/decision/${id}` }}
      notes={[
        "Auto-generated listing: title, condition grade, price (₹2,499), photos, and Warehouse Deals channel.",
        "Product Passport: grading provenance (Nova), defect map, authenticity check, carbon saved.",
        "Skeleton cards seeded from the hero ReturnItem (RTN-10481).",
        "CTA → Buyer Match.",
      ]}
    />
  );
}
