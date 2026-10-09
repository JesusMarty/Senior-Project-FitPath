import { Text, View, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";

// Replace with real data. cal: null means nothing logged yet.
const meals: { name: string; cal: number | null }[] = [
  { name: "Breakfast", cal: 400 },
  { name: "Lunch", cal: 600 },
  { name: "Dinner", cal: null },
  { name: "Snacks", cal: 500 },
];

const totals = { carbs: 100, protein: 80 };

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

export default function Tracking() {
  const totalCalories = meals.reduce((sum, m) => sum + (m.cal ?? 0), 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tracking</Text>
      <Text style={styles.subtitle}>Today’s meals and nutrition</Text>

      <Text style={styles.inputLabel}>Food search</Text>
      <TextInput
        style={styles.input}
        placeholder="Food search or scan barcode"
        placeholderTextColor="#444"
      />

      <Pressable
        style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
      >
        <Text style={styles.outlineButtonText}>Add food manually</Text>
      </Pressable>

      <View style={styles.mealList}>
        {meals.map((m) => (
          <View key={m.name} style={styles.mealRow}>
            <Text style={styles.mealName}>{m.name}</Text>
            <View style={styles.mealRight}>
              <Text style={styles.mealCal}>
                {m.cal === null ? "—" : `${m.cal} cal`}
              </Text>
              <Pressable hitSlop={10}>
                <Text style={styles.plus}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tileRow}>
        <StatTile value={fmt(totalCalories)} label="Calories" />
        <StatTile value={`${totals.carbs}g`} label="Carbs" />
        <StatTile value={`${totals.protein}g`} label="Protein" />
      </View>

      <Pressable
        style={({ pressed }) => [styles.darkButton, pressed && styles.pressed]}
      >
        <Text style={styles.darkButtonText}>Add food</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fafafa" },
  container: { padding: 16, paddingTop: 24, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 13, color: "#6b6b6b", marginTop: 4 },
  pressed: { opacity: 0.6 },

  inputLabel: { fontSize: 11, color: "#444", marginTop: 20, marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#111",
  },

  outlineButton: {
    marginTop: 12,
    height: 44,
    borderWidth: 1.5,
    borderColor: "#111",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  outlineButtonText: { fontSize: 13, fontWeight: "700", color: "#111" },

  mealList: { marginTop: 16 },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d9d9",
  },
  mealName: { fontSize: 14, color: "#6b6b6b" },
  mealRight: { flexDirection: "row", alignItems: "center" },
  mealCal: { fontSize: 14, color: "#111" },
  plus: { fontSize: 16, color: "#111", marginLeft: 8 },

  tileRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  tile: {
    flex: 1,
    backgroundColor: "#efefef",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tileValue: { fontSize: 17, fontWeight: "700", color: "#111" },
  tileLabel: { fontSize: 11, color: "#6b6b6b", marginTop: 2 },

  darkButton: {
    marginTop: 16,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  darkButtonText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});