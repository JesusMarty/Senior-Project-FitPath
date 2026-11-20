
import { supabase } from "../supabase";
import type { FoodMatch } from "./nutritionTypes";

type SearchResponse = {
  results?: FoodMatch[];
  error?: string;
};

export async function searchFoods(
  query: string,
  barcode = false
): Promise<FoodMatch[]> {

  console.log("Nutrition API connection test");
  console.log(
    "Supabase URL:",
    process.env.EXPO_PUBLIC_SUPABASE_URL
  );
  console.log(
    "API key exists:",
    !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.functions.invoke(
    "nutrition-search",
    {
      body: barcode
        ? { action: "barcode", barcode: query }
        : { action: "search", query }
    }
  );

  // Display the actual HTTP error returned by Supabase
  if (error) {
    console.error("Nutrition Function Error:", error);

    if ("context" in error && error.context instanceof Response) {
      console.error("HTTP Status:", error.context.status);

      const responseBody = await error.context.clone().text();

      console.error("Response Body:", responseBody);
    }

    throw new Error(
      error.message || "Unable to search foods."
    );
  }

  const response = data as SearchResponse;

  // Display errors returned by the Edge Function itself
  if (response.error) {
    console.error("Nutrition Search Error:", response.error);
    throw new Error(response.error);
  }

  return response.results ?? [];
}
