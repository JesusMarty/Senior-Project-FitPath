
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });

function getNutrient(
  nutrients: any[],
  id: number
): number {
  const item = nutrients.find(
    (n) => Number(n.nutrientId ?? n.nutrient?.id) === id
  );

  return Number(item?.value ?? item?.amount ?? 0);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const body = await req.json();
    const apiKey = Deno.env.get("USDA_API_KEY");

    if (!apiKey) {
      return jsonResponse({
        error: "USDA API key is not configured."
      }, 500);
    }

    // Search USDA by food name.
    if (body.action === "search") {
      const query = String(body.query ?? "").trim();

      if (!query || query.length > 150) {
        return jsonResponse({
          error: "Enter a valid food name."
        }, 400);
      }

      const url = new URL(
        "https://api.nal.usda.gov/fdc/v1/foods/search"
      );

      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("query", query);
      url.searchParams.set(
        "dataType",
        "Foundation,SR Legacy,Branded"
      );
      url.searchParams.set("pageSize", "12");

      const response = await fetch(url);

      if (!response.ok) {
        return jsonResponse({
          error: "USDA food search failed. Please try again."
        }, response.status === 429 ? 429 : 502);
      }

      const data = await response.json();

      const results = (data.foods ?? []).map((food: any) => {
        const nutrients = food.foodNutrients ?? [];

        return {
          id: String(food.fdcId),
          name: food.description,
          brand: food.brandOwner || food.brandName || "",
          source: "USDA",

          // USDA nutrient amounts are normalized per 100g.
          calories: getNutrient(nutrients, 1008),
          protein: getNutrient(nutrients, 1003),
          carbs: getNutrient(nutrients, 1005),
          fat: getNutrient(nutrients, 1004)
        };
      });

      return jsonResponse({ results });
    }

    // Search Open Food Facts using a product barcode.
    if (body.action === "barcode") {
      const barcode = String(body.barcode ?? "").trim();

      if (!/^\d{8,14}$/.test(barcode)) {
        return jsonResponse({
          error: "Enter a valid product barcode."
        }, 400);
      }

      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,brands,nutriments,code`,
        {
          headers: {
            "User-Agent": "FitPath/1.0 (food-tracking-app)"
          }
        }
      );

      
      if (!response.ok) {
        const errorBody = await response.text();

        console.error("USDA API Error Details:");
        console.error("HTTP Status:", response.status);
        console.error("Response Body:", errorBody);

        return jsonResponse({
          error: "USDA food search failed.",
          upstreamStatus: response.status,
          details: errorBody
        }, 502);
      }


      const data = await response.json();

      if (data.status !== 1 || !data.product) {
        return jsonResponse({
          error: "Product not found. Try searching by food name."
        }, 404);
      }

      const product = data.product;
      const nutrients = product.nutriments ?? {};

      const calories = Number(
        nutrients["energy-kcal_100g"] ??
        (
          Number(nutrients["energy_100g"] ?? 0) / 4.184
        )
      );

      const result = {
        id: String(product.code),
        name: product.product_name || "Packaged food",
        brand: product.brands || "",
        source: "Open Food Facts",

        calories: Number.isFinite(calories) ? calories : 0,
        protein: Number(nutrients.proteins_100g ?? 0),
        carbs: Number(nutrients.carbohydrates_100g ?? 0),
        fat: Number(nutrients.fat_100g ?? 0),
        barcode: String(product.code)
      };

      return jsonResponse({ results: [result] });
    }

    return jsonResponse({
      error: "Invalid search action."
    }, 400);

  } catch (error) {
    console.error("Nutrition API error:", error);

    return jsonResponse({
      error: "Something went wrong while retrieving nutrition data."
    }, 500);
  }
});
