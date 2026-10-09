import { Text, View, StyleSheet, ScrollView } from "react-native";

// Replace with real data (e.g. from your auth context / backend)
const data = {
  firstName: "User's Name",
  date: "Current Date(DD/MM/YYYY)",
  consumed: 1500,
  goal: 2500,
  carbs: 100,
  fat: 40,
  protein: 80,
  mealsEaten: 3,
  mealsPlanned: 5,
  workout: {
    name: "Workout Name",
    minutes: 35,
    exercises: 7,
    level: "Beginner",
  },
};

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function MacroTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

export default function Home() {
  const remaining = data.goal - data.consumed;
  const w = data.workout;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Good morning, {data.firstName}</Text>
      <Text style={styles.subtitle}>{data.date}</Text>

      <View style={styles.calorieCard}>
        <View style={styles.ring} />
        <View style={styles.calorieText}>
          <Text style={styles.calorieValue}>{fmt(data.consumed)}</Text>
          <Text style={styles.calorieSub}>
            of {fmt(data.goal)} kcal consumed
          </Text>
          <Text style={styles.calorieRemaining}>
            {fmt(remaining)} remaining
          </Text>
        </View>
      </View>

      <View style={styles.tileRow}>
        <MacroTile value={`${data.carbs}g`} label="Carbs" />
        <MacroTile value={`${data.fat}g`} label="Fat" />
        <MacroTile value={`${data.protein}g`} label="Protein" />
      </View>

      <View style={styles.mealsRow}>
        <Text style={styles.mealsLabel}>Meals eaten</Text>
        <Text style={styles.mealsValue}>
          {data.mealsEaten} of {data.mealsPlanned}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Today’s workout</Text>
      <View style={styles.workoutCard}>
        <Text style={styles.workoutName}>{w.name}</Text>
        <Text style={styles.workoutMeta}>
          {w.minutes} min • {w.exercises} exercises • {w.level}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fafafa" },
  container: { padding: 16, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 13, color: "#6b6b6b", marginTop: 4 },

  calorieCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 14,
    backgroundColor: "#fafafa",
  },
  // Simple full ring. For a real progress ring use react-native-svg.
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 8,
    borderColor: "#111",
    marginRight: 16,
  },
  calorieText: { flex: 1 },
  calorieValue: { fontSize: 22, fontWeight: "700", color: "#111" },
  calorieSub: { fontSize: 12, color: "#6b6b6b", marginTop: 2 },
  calorieRemaining: { fontSize: 12, color: "#111", marginTop: 4 },

  tileRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  tile: {
    flex: 1,
    backgroundColor: "#efefef",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tileValue: { fontSize: 17, fontWeight: "700", color: "#111" },
  tileLabel: { fontSize: 11, color: "#6b6b6b", marginTop: 2 },

  mealsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginTop: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d9d9",
  },
  mealsLabel: { fontSize: 14, color: "#6b6b6b" },
  mealsValue: { fontSize: 14, color: "#111" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginTop: 22,
    marginBottom: 12,
  },
  workoutCard: {
    backgroundColor: "#efefef",
    borderRadius: 8,
    padding: 14,
  },
  workoutName: { fontSize: 15, fontWeight: "700", color: "#111" },
  workoutMeta: { fontSize: 12, color: "#6b6b6b", marginTop: 4 },
});