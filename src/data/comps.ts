import type { FateEvaluation } from "./types";

/**
 * Seeded EV inputs the LIVE decision call reasons over (docs/03_DATA_MODEL.md).
 * Resell has the max netValue → the decision deterministically lands on Resell
 * even though the reasoning trace is generated live by Nova.
 */
export const heroEvaluations: FateEvaluation[] = [
  { fate: "Resell", recoveryValue: 2499, refurbCost: 0, logisticsCost: 140, timeToSellDays: 6, carbonDeltaKg: 1.8, netValue: 2359 },
  { fate: "Refurbish", recoveryValue: 2120, refurbCost: 180, logisticsCost: 140, timeToSellDays: 11, carbonDeltaKg: 1.2, netValue: 1800 },
  { fate: "Exchange", recoveryValue: 1640, refurbCost: 0, logisticsCost: 160, timeToSellDays: 3, carbonDeltaKg: 0.9, netValue: 1480 },
  { fate: "Donate", recoveryValue: 0, refurbCost: 0, logisticsCost: 90, timeToSellDays: 0, carbonDeltaKg: 1.5, netValue: -90 },
  { fate: "Recycle", recoveryValue: 95, refurbCost: 0, logisticsCost: 80, timeToSellDays: 0, carbonDeltaKg: 0.0, netValue: 15 },
];

/** Comparable active listings shown as supporting evidence on Decision Theater. */
export interface Comp {
  title: string;
  condition: string;
  price: number;
  soldInDays: number;
  marketplace: string;
}

export const heroComps: Comp[] = [
  { title: "Men's Road Running Shoes Sz 9 — Like New", condition: "Like-New", price: 2599, soldInDays: 5, marketplace: "Amazon Warehouse" },
  { title: "Road Running Shoes Sz 9 (Open Box)", condition: "Very Good", price: 2349, soldInDays: 8, marketplace: "Amazon Renewed" },
  { title: "Men's Running Shoes Sz 9 — Pre-owned", condition: "Good", price: 1999, soldInDays: 12, marketplace: "Amazon Warehouse" },
];
