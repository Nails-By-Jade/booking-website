export type Service = {
  slug: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  swatch: string;
  priceLabel?: string;
  startingAt?: boolean;
};

export const services: Service[] = [
  {
    slug: "gel-polish-long",
    name: "Soft Gel Extensions",
    description:
      "Gel polish over extended length, shaped and finished to your preference.",
    duration: 120,
    price: 350,
    startingAt: true,
    swatch: "#FF6F91",
  },
  {
    slug: "gel-polish-only",
    name: "Gel Polish Only",
    description: "Gel polish on your natural nail length. Clean, glossy, long-lasting.",
    duration: 60,
    price: 250,
    startingAt: true,
    swatch: "#F4C2C2",
  },
  {
    slug: "press-on-nails",
    name: "Press On Nails",
    description: "Hand-designed press-ons for an instant manicure that looks polished, pretty, and uniquely you.",
    duration: 60,
    price: 0,
    priceLabel: "Price varies",
    swatch: "#D4AF6A",
  },
  // {
  //   slug: "nail-art-custom",
  //   name: "Nail Art Custom Set",
  //   description:
  //     "Fully custom hand-painted set — tell us your inspiration and we'll design it.",
  //   duration: 90,
  //   price: 500,
  //   startingAt: true,
  //   swatch: "#D4AF6A",
  // },
];

export type AddOn = {
  name: string;
  description: string;
};

// Add-ons 
export const addOns: AddOn[] = [
  {
    name: "3D Nails",
    description: "+₱5 per nail, added on top of any service.",
  },
  {
    name: "Length Charge",
    description:
      "Extra charge for extended length depends on how long you'd like your nails — let your tech know in the notes when booking, or ask in person.",
  },
  {
    name: "Custom Nail Art",
    description:
      "Add your favorite designs, details, or tiny accents to make your set uniquely yours. Pricing depends on the design.",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}