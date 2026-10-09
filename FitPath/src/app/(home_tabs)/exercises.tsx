import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: number;
};

// Replace with data from your workout plan
const EXERCISES: Exercise[] = [
  { name: "Goblet squat", sets: 3, reps: "10 reps", rest: 60 },
  { name: "Incline push-up", sets: 3, reps: "8 reps", rest: 45 },
  { name: "Seated cable row", sets: 3, reps: "12 reps", rest: 60 },
  { name: "Dead bug", sets: 3, reps: "10 / side", rest: 30 },
];

const plan = { minutes: 35, level: "Beginner" };

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

export default function Exercises() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recommended Exercises</Text>
      <Text style={styles.subtitle}>
        Tailored to your beginner plan and gym access
      </Text>

      <View style={styles.tileRow}>
        <StatTile value={`${plan.minutes} min`} label="Duration" />
        <StatTile value={`${EXERCISES.length}`} label="Exercises" />
        <StatTile value={plan.level} label="Level" />
      </View>

      {EXERCISES.map((e) => (
        <Pressable
          key={e.name}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.thumb} />
          <View style={styles.cardBody}>
            <Text style={styles.cardName}>{e.name}</Text>
            <Text style={styles.cardMeta}>
              {e.sets} sets • {e.reps} • Rest {e.rest} sec
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      <Pressable
        style={({ pressed }) => [styles.darkButton, pressed && styles.pressed]}
      >
        <Text style={styles.darkButtonText}>Start workout</Text>
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

  tileRow: { flexDirection: "row", gap: 8, marginTop: 16, marginBottom: 16 },
  tile: {
    flex: 1,
    backgroundColor: "#efefef",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tileValue: { fontSize: 16, fontWeight: "700", color: "#111" },
  tileLabel: { fontSize: 11, color: "#6b6b6b", marginTop: 2 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: "#efefef",
    marginRight: 12,
  },
  cardBody: { flex: 1 },
  cardName: { fontSize: 13, fontWeight: "700", color: "#111" },
  cardMeta: { fontSize: 11, color: "#6b6b6b", marginTop: 3 },
  chevron: { fontSize: 18, color: "#111", marginLeft: 8, alignSelf: "flex-start" },

  darkButton: {
    marginTop: 4,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  darkButtonText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});