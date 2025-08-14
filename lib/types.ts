export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Breakfast" | "Batters" | "Snacks" | "Desserts" | "Beverages" | string;
  tags: string[];
  available: boolean;
};
