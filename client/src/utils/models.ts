// Model portfolios recommended by Charles Schwab

export interface Portfolio {
  name: string;
  stocks: number;
  bonds: number;
  cash: number;
  description: string;
}

export const portfolios: Portfolio[] = [
  {
    name: "Conservative",
    stocks: 30,
    bonds: 50,
    cash: 20,
    description:
      "Stable growth with a focus on preserving capital. Ideal for cautious investors.",
  },
  {
    name: "Moderate",
    stocks: 60,
    bonds: 30,
    cash: 10,
    description:
      "Balanced growth with diversified assets. Suitable for medium-risk investors.",
  },
  {
    name: "Aggressive",
    stocks: 80,
    bonds: 15,
    cash: 5,
    description:
      "High growth potential with more market fluctuations. For risk-tolerant investors.",
  },
];
