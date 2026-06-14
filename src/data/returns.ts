import type { ReturnItem } from "./types";

/**
 * The canonical hero return — source of truth = docs/03_DATA_MODEL.md.
 * Live grading should land ~Like-New; decision should land Resell.
 */
export const heroReturn: ReturnItem = {
  id: "RTN-10481",
  sku: "SKU-4471",
  title: "Men's Road Running Shoes — Size 9",
  category: "Footwear",
  reason: "too small",
  orderValue: 3499,
  status: "queued",
  isHero: true,
  photos: [
    {
      url: "/demo/shoe-1.jpg",
      alt: "Men's road running shoes, side profile, like-new condition with minor outsole wear",
    },
    {
      url: "/demo/shoe-2.jpg",
      alt: "Men's road running shoes, top-down view showing laces and upper mesh",
    },
    {
      url: "/demo/shoe-3.jpg",
      alt: "Men's road running shoes, outsole close-up showing minor tread wear",
    },
  ],
};

/** ~14 filler returns so the Inbox feels real. Basic fields + status only. */
const fillerReturns: ReturnItem[] = [
  {
    id: "RTN-10482",
    sku: "SKU-2210",
    title: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    reason: "changed my mind",
    orderValue: 8999,
    status: "deciding",
    photos: [],
  },
  {
    id: "RTN-10483",
    sku: "SKU-7788",
    title: "Cotton Crewneck T-Shirt (Pack of 2)",
    category: "Apparel",
    reason: "color not as shown",
    orderValue: 1299,
    status: "listed",
    photos: [],
  },
  {
    id: "RTN-10484",
    sku: "SKU-3391",
    title: "Stainless Steel Air Fryer 4L",
    category: "Home & Kitchen",
    reason: "defective — won't power on",
    orderValue: 5499,
    status: "flagged",
    photos: [],
  },
  {
    id: "RTN-10485",
    sku: "SKU-1102",
    title: "Bluetooth Mechanical Keyboard",
    category: "Electronics",
    reason: "wrong layout ordered",
    orderValue: 4299,
    status: "grading",
    photos: [],
  },
  {
    id: "RTN-10486",
    sku: "SKU-9043",
    title: "Yoga Mat 6mm — Charcoal",
    category: "Sports",
    reason: "thinner than expected",
    orderValue: 1599,
    status: "saved",
    photos: [],
  },
  {
    id: "RTN-10487",
    sku: "SKU-5567",
    title: "Kids' Building Blocks Set (250 pc)",
    category: "Toys",
    reason: "missing pieces",
    orderValue: 2199,
    status: "queued",
    photos: [],
  },
  {
    id: "RTN-10488",
    sku: "SKU-6620",
    title: "Ceramic Non-Stick Cookware Set",
    category: "Home & Kitchen",
    reason: "arrived damaged",
    orderValue: 6799,
    status: "flagged",
    photos: [],
  },
  {
    id: "RTN-10489",
    sku: "SKU-8814",
    title: "Slim-Fit Denim Jacket",
    category: "Apparel",
    reason: "too large",
    orderValue: 2899,
    status: "queued",
    photos: [],
  },
  {
    id: "RTN-10490",
    sku: "SKU-4407",
    title: "Smart LED Bulb (4-pack)",
    category: "Electronics",
    reason: "app won't pair",
    orderValue: 1899,
    status: "deciding",
    photos: [],
  },
  {
    id: "RTN-10491",
    sku: "SKU-2255",
    title: "Insulated Water Bottle 1L",
    category: "Sports",
    reason: "changed my mind",
    orderValue: 1099,
    status: "listed",
    photos: [],
  },
  {
    id: "RTN-10492",
    sku: "SKU-3380",
    title: "Wooden Coffee Table — Walnut",
    category: "Furniture",
    reason: "scratch on surface",
    orderValue: 9499,
    status: "grading",
    photos: [],
  },
  {
    id: "RTN-10493",
    sku: "SKU-7711",
    title: "Running Socks (6 pairs)",
    category: "Apparel",
    reason: "wrong size",
    orderValue: 799,
    status: "saved",
    photos: [],
  },
  {
    id: "RTN-10494",
    sku: "SKU-9921",
    title: "Action Camera 4K + Mount Kit",
    category: "Electronics",
    reason: "found cheaper elsewhere",
    orderValue: 7299,
    status: "queued",
    photos: [],
  },
  {
    id: "RTN-10495",
    sku: "SKU-1184",
    title: "Memory Foam Pillow (2-pack)",
    category: "Home & Kitchen",
    reason: "too firm",
    orderValue: 1999,
    status: "deciding",
    photos: [],
  },
];

/** Hero first, then fillers. */
export const returns: ReturnItem[] = [heroReturn, ...fillerReturns];

export function getReturn(id: string): ReturnItem | undefined {
  return returns.find((r) => r.id === id);
}
