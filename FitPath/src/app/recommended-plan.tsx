
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

const days = [
  { id: "Monday", label: "M" },
  { id: "Tuesday", label: "T" },
  { id: "Wednesday", label: "W" },
  { id: "Thursday", label: "T" },
  { id: "Friday", label: "F" },
  { id: "Saturday", label: "S" },
  { id: "Sunday", label: "S" },
];

const defaultDays = [
  "Monday",
  "Wednesday",
  "Friday",
  "Saturday",
];

export default function RecommendedPlan() {
  const { mode } = useLocalSearchParams<{
  mode?: string;
}>();

const isEditing = mode === "edit";
  const [selectedDays, setSelectedDays] =
    useState<string[]>(defaultDays);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadDays = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        if (!authData.user) {
          throw new Error("Please sign in first.");
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("workout_days")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (error) throw error;

        if (
          active &&
          Array.isArray(data?.workout_days)
        ) {
          setSelectedDays(data.workout_days);
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load workout days."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDays();

    return () => {
      active = false;
    };
  }, []);

  const toggleDay = (day: string) => {
    setMessage("");

    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day]
    );
  };

  const handleContinue = async () => {
    if (selectedDays.length === 0) {
      setMessage("Please select at least one workout day.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Please sign in first.");
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: authData.user.id,
            workout_days: selectedDays,
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      if (isEditing) {
  router.replace("/(home_tabs)/account");
} else {
  router.replace("/(home_tabs)/home");
}
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save workout days."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.step}>Step 6 of 6</Text>
      </View>

      <View style={styles.progressContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            style={styles.progressActive}
          />
        ))}
      </View>

      <Text style={styles.title}>
        Your recommended plan
      </Text>

      <Text style={styles.subtitle}>
        Built from your goal, activity, and preferences.
      </Text>

      <View style={styles.card}>
        <Text style={styles.planTitle}>
          Steady Start
        </Text>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Weekly schedule
          </Text>
          <Text style={styles.dataValue}>
            {selectedDays.length} workouts
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Calorie target
          </Text>
          <Text style={styles.dataValue}>
            2,050 kcal
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Protein
          </Text>
          <Text style={styles.dataValue}>
            145 g
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Carbs
          </Text>
          <Text style={styles.dataValue}>
            220 g
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Fat
          </Text>
          <Text style={styles.dataValue}>
            65 g
          </Text>
        </View>
      </View>

      <Text style={styles.scheduleTitle}>
        Workout days
      </Text>

      <Text style={styles.scheduleHint}>
        Tap to select your preferred workout days.
      </Text>

      <View style={styles.daysRow}>
        {days.map((day) => {
          const selected =
            selectedDays.includes(day.id);

          return (
            <Pressable
              key={day.id}
              accessibilityRole="checkbox"
              accessibilityLabel={day.id}
              accessibilityState={{
                checked: selected,
              }}
              onPress={() => toggleDay(day.id)}
              style={[
                styles.day,
                selected
                  ? styles.activeDay
                  : styles.inactiveDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selected
                    ? styles.activeDayText
                    : styles.inactiveDayText,
                ]}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.selectedText}>
        {selectedDays.length} day(s) selected
      </Text>

      {message !== "" && (
        <Text style={styles.message}>
          {message}
        </Text>
      )}

      <Pressable
        style={[
          styles.button,
          (saving || loading) && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={saving || loading}
      >
        {saving || loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isEditing ? "Save Changes" : "Continue to FitPath"}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: "500",
  },
  step: {
    fontSize: 14,
    color: "#555",
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 20,
    marginBottom: 30,
  },
  progressActive: {
    flex: 1,
    height: 3,
    backgroundColor: "#292929",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 18,
    marginBottom: 22,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  dataLabel: {
    fontSize: 14,
    color: "#666",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  scheduleHint: {
    fontSize: 13,
    color: "#666",
    marginBottom: 14,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 4,
  },
  day: {
    flex: 1,
    maxWidth: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDay: {
    backgroundColor: "#292929",
  },
  inactiveDay: {
    backgroundColor: "#f2f2f2",
  },
  dayText: {
    fontWeight: "600",
  },
  activeDayText: {
    color: "#fff",
  },
  inactiveDayText: {
    color: "#292929",
  },
  selectedText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: "#d32f2f",
    marginBottom: 12,
  },
  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
