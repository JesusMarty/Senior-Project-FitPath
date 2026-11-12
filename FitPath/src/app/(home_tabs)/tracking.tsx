
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { supabase } from "../../lib/supabase";

import { searchFoods } from "../../lib/nutrition/nutritionApi";

import {
  FoodMatch,
  FoodLog,
  MealType,
  WeightUnit,
  UNIT_TO_GRAMS
} from "../../lib/nutrition/nutritionTypes";

const meals: MealType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks"
];

const units: WeightUnit[] = ["g", "kg", "oz", "lb"];

const fmt = (n: number) =>
  Math.round(n).toLocaleString("en-US");

const round = (n: number) =>
  Math.round(n * 10) / 10;

function getLocalDayRange() {
  const start = new Date();

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}

// Extract quantities from inputs like "4 oz chicken breast".
function parseFoodInput(input: string) {
  const match = input.match(
    /^\s*(\d+(?:\.\d+)?)\s*(kg|kilograms?|g|grams?|oz|ounces?|lbs?|pounds?)\s+(?:of\s+)?(.+)$/i
  );

  if (!match) return null;

  const unitText = match[2].toLowerCase();

  let unit: WeightUnit = "g";

  if (unitText.startsWith("kg") || unitText.startsWith("kilo")) {
    unit = "kg";
  } else if (unitText === "oz" || unitText.startsWith("ounce")) {
    unit = "oz";
  } else if (unitText.startsWith("lb") || unitText.startsWith("pound")) {
    unit = "lb";
  }

  return {
    quantity: match[1],
    unit,
    food: match[3].trim()
  };
}

function StatTile({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

export default function Tracking() {
  const [logs, setLogs] = useState<FoodLog[]>([]);

  const [meal, setMeal] = useState<MealType>("Breakfast");

  const [foodQuery, setFoodQuery] = useState("");

  const [quantity, setQuantity] = useState("100");

  const [unit, setUnit] = useState<WeightUnit>("g");

  const [results, setResults] = useState<FoodMatch[]>([]);

  const [selectedFood, setSelectedFood] =
    useState<FoodMatch | null>(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // Load today's food logs from Supabase.
  useEffect(() => {
    loadTodayLogs();
  }, []);

  async function loadTodayLogs() {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      setError("Please log in to use food tracking.");
      return;
    }

    const { start, end } = getLocalDayRange();

    const { data, error: dbError } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", authData.user.id)
      .gte("logged_at", start)
      .lt("logged_at", end)
      .order("logged_at", { ascending: true });

    if (dbError) {
      console.error(dbError);
      setError("Unable to load your food logs.");
      return;
    }

    setLogs((data ?? []) as FoodLog[]);
  }

  // Search USDA or Open Food Facts.
  async function handleSearch() {
    let query = foodQuery.trim();

    if (!query) {
      Alert.alert("Missing food", "Please enter a food name.");
      return;
    }

    const parsed = parseFoodInput(query);

    if (parsed) {
      setQuantity(parsed.quantity);
      setUnit(parsed.unit);
      query = parsed.food;
      setFoodQuery(parsed.food);
    }

    const isBarcode = /^\d{8,14}$/.test(query);

    setLoading(true);
    setError("");
    setResults([]);
    setSelectedFood(null);

    try {
      const foods = await searchFoods(query, isBarcode);

      if (foods.length === 0) {
        setError("No matching foods found. Try another description.");
      }

      setResults(foods);
    } catch (err: any) {
      setError(err.message || "Food search failed.");
    } finally {
      setLoading(false);
    }
  }

  // Calculate nutrition based on the entered quantity.
  const grams =
    (Number(quantity) || 0) * UNIT_TO_GRAMS[unit];

  const factor = grams / 100;

  const calculated = selectedFood
    ? {
        calories: round(selectedFood.calories * factor),
        protein: round(selectedFood.protein * factor),
        carbs: round(selectedFood.carbs * factor),
        fat: round(selectedFood.fat * factor)
      }
    : null;

  // Save food to Supabase.
  async function addFood() {
    if (!selectedFood) return;

    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert("Invalid quantity", "Enter a quantity greater than zero.");
      return;
    }

    if (!Number.isFinite(grams) || grams <= 0) {
      Alert.alert("Invalid quantity", "Please check your measurement.");
      return;
    }

    setSaving(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw new Error("Please log in before adding food.");
      }

      const { data, error: dbError } = await supabase
        .from("food_logs")
        .insert({
          user_id: authData.user.id,
          food_name: selectedFood.name,
          meal_type: meal,
          quantity: Number(quantity),
          unit,
          amount_grams: grams,

          calories: calculated!.calories,
          protein_g: calculated!.protein,
          carbs_g: calculated!.carbs,
          fat_g: calculated!.fat,

          data_source: selectedFood.source,
          fdc_id:
            selectedFood.source === "USDA"
              ? selectedFood.id
              : null,

          barcode: selectedFood.barcode ?? null,
          logged_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setLogs((previous) => [
        ...previous,
        data as FoodLog
      ]);

      setSelectedFood(null);
      setResults([]);
      setFoodQuery("");
      setQuantity("100");
      setUnit("g");

      Alert.alert("Food added", "Your nutrition tracker has been updated.");

    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Unable to save food.");
    } finally {
      setSaving(false);
    }
  }

  // Delete a logged food.
  async function deleteFood(id: string) {
    Alert.alert(
      "Remove food",
      "Are you sure you want to remove this food?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("food_logs")
              .delete()
              .eq("id", id);

            if (error) {
              Alert.alert("Error", "Unable to remove food.");
              return;
            }

            setLogs((previous) =>
              previous.filter((item) => item.id !== id)
            );
          }
        }
      ]
    );
  }

  // Daily totals.
  const totals = logs.reduce(
    (sum, item) => ({
      calories: sum.calories + Number(item.calories),
      protein: sum.protein + Number(item.protein_g),
      carbs: sum.carbs + Number(item.carbs_g),
      fat: sum.fat + Number(item.fat_g)
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Tracking</Text>

      <Text style={styles.subtitle}>
        Today's meals and nutrition
      </Text>

      {/* Daily nutrition totals */}
      <Text style={styles.sectionTitle}>Daily Nutrition</Text>

      <View style={styles.tileRow}>
        <StatTile
          value={fmt(totals.calories)}
          label="Calories"
        />

        <StatTile
          value={`${round(totals.protein)}g`}
          label="Protein"
        />
      </View>

      <View style={styles.tileRow}>
        <StatTile
          value={`${round(totals.carbs)}g`}
          label="Carbs"
        />

        <StatTile
          value={`${round(totals.fat)}g`}
          label="Fat"
        />
      </View>

      {/* Food search */}
      <Text style={styles.sectionTitle}>Add Food</Text>

      <Text style={styles.inputLabel}>Select meal</Text>

      <View style={styles.mealSelector}>
        {meals.map((item) => (
          <Pressable
            key={item}
            onPress={() => setMeal(item)}
            style={[
              styles.mealOption,
              meal === item && styles.mealSelected
            ]}
          >
            <Text
              style={[
                styles.mealOptionText,
                meal === item && styles.mealSelectedText
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.inputLabel}>Food description or barcode</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 4 oz chicken breast"
        placeholderTextColor="#777"
        value={foodQuery}
        onChangeText={setFoodQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
      />

      <Text style={styles.inputLabel}>Quantity</Text>

      <View style={styles.quantityRow}>
        <TextInput
          style={[styles.input, styles.quantityInput]}
          placeholder="100"
          keyboardType="decimal-pad"
          value={quantity}
          onChangeText={setQuantity}
        />

        <View style={styles.unitSelector}>
          {units.map((item) => (
            <Pressable
              key={item}
              onPress={() => setUnit(item)}
              style={[
                styles.unitButton,
                unit === item && styles.unitSelected
              ]}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === item && styles.unitSelectedText
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.helperText}>
        You can enter a quantity directly in the food description,
        such as "4 oz chicken breast".
      </Text>

      <Pressable
        onPress={handleSearch}
        disabled={loading}
        style={({ pressed }) => [
          styles.darkButton,
          pressed && styles.pressed,
          loading && styles.disabled
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.darkButtonText}>
            Search Food Database
          </Text>
        )}
      </Pressable>

      {!!error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>
            Select Matching Food
          </Text>

          {results.map((food) => (
            <Pressable
              key={`${food.source}-${food.id}`}
              onPress={() => {
                setSelectedFood(food);
                setResults([]);
              }}
              style={styles.resultRow}
            >
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>
                  {food.name}
                </Text>

                {!!food.brand && (
                  <Text style={styles.helperText}>
                    {food.brand}
                  </Text>
                )}

                <Text style={styles.helperText}>
                  {food.source} · Per 100g
                </Text>
              </View>

              <Text style={styles.resultCalories}>
                {fmt(food.calories)} cal
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Nutrition confirmation */}
      {selectedFood && calculated && (
        <View style={styles.confirmCard}>
          <Text style={styles.sectionTitle}>
            Confirm Food
          </Text>

          <Text style={styles.selectedFoodName}>
            {selectedFood.name}
          </Text>

          <Text style={styles.helperText}>
            {meal} · {quantity} {unit} ({round(grams)}g)
          </Text>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Calories</Text>
            <Text style={styles.nutritionValue}>
              {fmt(calculated.calories)} kcal
            </Text>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={styles.nutritionValue}>
              {calculated.protein}g
            </Text>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={styles.nutritionValue}>
              {calculated.carbs}g
            </Text>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Fat</Text>
            <Text style={styles.nutritionValue}>
              {calculated.fat}g
            </Text>
          </View>

          <Pressable
            onPress={addFood}
            disabled={saving}
            style={styles.darkButton}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.darkButtonText}>
                Add Food to Daily Tracker
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => setSelectedFood(null)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Meal logs */}
      <Text style={styles.sectionTitle}>Today's Meals</Text>

      {meals.map((mealName) => {
        const mealLogs = logs.filter(
          (item) => item.meal_type === mealName
        );

        const mealCalories = mealLogs.reduce(
          (sum, item) => sum + Number(item.calories),
          0
        );

        return (
          <View key={mealName} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealHeading}>
                {mealName}
              </Text>

              <Text style={styles.mealTotal}>
                {fmt(mealCalories)} cal
              </Text>
            </View>

            {mealLogs.length === 0 ? (
              <Text style={styles.emptyText}>
                No food logged yet.
              </Text>
            ) : (
              mealLogs.map((item) => (
                <View key={item.id} style={styles.foodRow}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>
                      {item.food_name}
                    </Text>

                    <Text style={styles.helperText}>
                      {item.quantity} {item.unit} ·
                      {" "}{fmt(item.calories)} cal
                    </Text>

                    <Text style={styles.helperText}>
                      P: {round(Number(item.protein_g))}g ·
                      C: {round(Number(item.carbs_g))}g ·
                      F: {round(Number(item.fat_g))}g
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => deleteFood(item.id)}
                    hitSlop={10}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        );
      })}

      <Text style={styles.footerText}>
        Nutrition information is estimated from food database records.
        Choose the closest matching food and preparation method.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fafafa"
  },

  container: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111"
  },

  subtitle: {
    fontSize: 13,
    color: "#6b6b6b",
    marginTop: 4
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginTop: 24,
    marginBottom: 10
  },

  inputLabel: {
    fontSize: 12,
    color: "#444",
    marginTop: 14,
    marginBottom: 6
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#111"
  },

  tileRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8
  },

  tile: {
    flex: 1,
    backgroundColor: "#efefef",
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 12
  },

  tileValue: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111"
  },

  tileLabel: {
    fontSize: 11,
    color: "#6b6b6b",
    marginTop: 3
  },

  mealSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },

  mealOption: {
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff"
  },

  mealSelected: {
    backgroundColor: "#2a2a2a",
    borderColor: "#2a2a2a"
  },

  mealOptionText: {
    color: "#333",
    fontSize: 11,
    fontWeight: "600"
  },

  mealSelectedText: {
    color: "#fff"
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  quantityInput: {
    flex: 1
  },

  unitSelector: {
    flexDirection: "row",
    gap: 4
  },

  unitButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 11
  },

  unitSelected: {
    backgroundColor: "#2a2a2a",
    borderColor: "#2a2a2a"
  },

  unitText: {
    fontSize: 12,
    color: "#333"
  },

  unitSelectedText: {
    color: "#fff"
  },

  helperText: {
    fontSize: 11,
    color: "#777",
    marginTop: 4
  },

  darkButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center"
  },

  darkButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff"
  },

  pressed: {
    opacity: 0.6
  },

  disabled: {
    opacity: 0.5
  },

  errorText: {
    color: "#c0392b",
    fontSize: 12,
    marginTop: 10
  },

  resultsContainer: {
    marginTop: 10
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc"
  },

  resultInfo: {
    flex: 1,
    paddingRight: 10
  },

  resultName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111"
  },

  resultCalories: {
    fontSize: 13,
    color: "#111",
    fontWeight: "600"
  },

  confirmCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginTop: 18
  },

  selectedFoodName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111"
  },

  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd"
  },

  nutritionLabel: {
    fontSize: 13,
    color: "#555"
  },

  nutritionValue: {
    fontSize: 13,
    color: "#111",
    fontWeight: "700"
  },

  cancelButton: {
    alignItems: "center",
    padding: 10
  },

  cancelText: {
    color: "#555",
    fontSize: 12
  },

  mealCard: {
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 13,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e1e1e1"
  },

  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },

  mealHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111"
  },

  mealTotal: {
    fontSize: 12,
    color: "#555"
  },

  emptyText: {
    fontSize: 12,
    color: "#888",
    paddingVertical: 10
  },

  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd"
  },

  foodInfo: {
    flex: 1
  },

  foodName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222"
  },

  deleteText: {
    fontSize: 24,
    color: "#c0392b",
    paddingHorizontal: 8
  },

  footerText: {
    fontSize: 10,
    color: "#888",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 16
  }
});
