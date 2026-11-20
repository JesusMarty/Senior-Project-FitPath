
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export type WeightUnit = "g" | "kg" | "oz" | "lb";

export type FoodMatch = {
  id: string;
  name: string;
  brand?: string;
  source: "USDA" | "Open Food Facts";

  // All nutrient values are per 100 grams.
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  barcode?: string;
};

export type FoodLog = {
  id: string;
  user_id: string;
  food_name: string;
  meal_type: MealType;
  quantity: number;
  unit: WeightUnit;
  amount_grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  data_source: string;
  fdc_id: string | null;
  barcode: string | null;
  logged_at: string;
};

export const UNIT_TO_GRAMS: Record<WeightUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592
};
