import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";

type Place = {
  name: string;
  miles: number;
  type: string;
  cal: number;
  open: boolean;
};

// Replace with real results from your places / food API
const PLACES: Place[] = [
  { name: "Green Bowl Kitchen", miles: 0.4, type: "Harvest bowl", cal: 410, open: true },
  { name: "Daily Grain", miles: 0.8, type: "Chicken & rice", cal: 465, open: true },
  { name: "Fresh Press Café", miles: 1.2, type: "Turkey wrap", cal: 390, open: true },
];

type FilterKey = "cal" | "open" | "dist";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "cal", label: "Under 500 cal" },
  { key: "open", label: "Open now" },
  { key: "dist", label: "≤ 2 mi" },
];

export default function Local_Food() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<FilterKey[]>([]);

  const toggle = (key: FilterKey) =>
    setActive((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const results = PLACES.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q && !`${p.name} ${p.type}`.toLowerCase().includes(q)) return false;
    if (active.includes("cal") && p.cal >= 500) return false;
    if (active.includes("open") && !p.open) return false;
    if (active.includes("dist") && p.miles > 2) return false;
    return true;
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Local Food</Text>
      <Text style={styles.subtitle}>Low-calorie options near you</Text>

      <Text style={styles.inputLabel}>Search nearby food</Text>
      <TextInput
        style={styles.input}
        placeholder="Search restaurants or meals"
        placeholderTextColor="#444"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.chipRow}>
        {FILTERS.map((f) => {
          const on = active.includes(f.key);
          return (
            <Pressable
              key={f.key}
              onPress={() => toggle(f.key)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {results.map((p) => (
        <Pressable
          key={p.name}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.thumb} />
          <View style={styles.cardBody}>
            <Text style={styles.cardName}>{p.name}</Text>
            <Text style={styles.cardMeta}>
              {p.miles} mi • {p.type} • {p.cal} cal
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      {/* Map placeholder */}
      <View style={styles.map} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fafafa" },
  container: { padding: 16, paddingTop: 24, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 13, color: "#6b6b6b", marginTop: 4 },

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

  chipRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 16 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    backgroundColor: "#fafafa",
  },
  chipOn: { backgroundColor: "#2a2a2a", borderColor: "#2a2a2a" },
  chipText: { fontSize: 12, color: "#111" },
  chipTextOn: { color: "#fff" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  pressed: { opacity: 0.6 },
  thumb: {
    width: 38,
    height: 38,
    borderRadius: 4,
    backgroundColor: "#efefef",
    marginRight: 10,
  },
  cardBody: { flex: 1 },
  cardName: { fontSize: 13, fontWeight: "700", color: "#111" },
  cardMeta: { fontSize: 11, color: "#6b6b6b", marginTop: 3 },
  chevron: { fontSize: 18, color: "#111", marginLeft: 8, alignSelf: "flex-start" },

  map: {
    height: 220,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 10,
    backgroundColor: "#efefef",
  },
});