import type { Buyer } from "./types";

/** Synthetic buyers for Screen 6 (Person 2). */
export const buyers: Buyer[] = [
  {
    id: "BYR-001",
    name: "Aarav M.",
    matchScore: 94,
    signal: "Searched 'running shoes size 9' 3× this week · Prime member",
    budget: 2800,
    greenCreditsOffered: 120,
  },
  {
    id: "BYR-002",
    name: "Priya S.",
    matchScore: 88,
    signal: "Abandoned cart with similar SKU · opted into Renewed deals",
    budget: 2500,
    greenCreditsOffered: 120,
  },
  {
    id: "BYR-003",
    name: "Rohan K.",
    matchScore: 81,
    signal: "Browsed Warehouse Deals footwear · price-sensitive",
    budget: 2200,
    greenCreditsOffered: 90,
  },
];
