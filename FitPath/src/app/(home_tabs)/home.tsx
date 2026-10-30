
import { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";

// Demo fitness data until database integration
const data = {
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

const fmt = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function MacroTile({
  value,
  label,
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

export default function Home() {
  const [firstName, setFirstName] = useState("FitPath User");
  const [profile, setProfile] = useState<{
  current_weight: number | null;
  goal_weight: number | null;
  fitness_goal: string | null;
  workout_days: string[] | null;
  gym_access: boolean | null;
} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadUser = async () => {
        setLoading(true);
        setError("");

        try {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (!active) return;

          if (authError) {
            setError(authError.message);
            return;
          }

          if (!user) {
            router.replace("/login");
            return;
          }

          const fullName =
            typeof user.user_metadata?.full_name === "string"
              ? user.user_metadata.full_name.trim()
              : "";

          const name = fullName
            ? fullName.split(/\s+/)[0]
            : "FitPath User";

          setFirstName(name);
          const { data: profileData, error: profileError } =
  await supabase
    .from("profiles")
    .select(
      "current_weight, goal_weight, fitness_goal, workout_days, gym_access"
    )
    .eq("id", user.id)
    .maybeSingle();

if (profileError) throw profileError;

if (active) {
  setProfile(profileData);
}
        } catch (err) {
          if (active) {
            console.error("Home user error:", err);
            setError("Unable to load your profile.");
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadUser();

      return () => {
        active = false;
      };
    }, [])
  );

  const remaining = data.goal - data.consumed;
  const w = data.workout;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#292929" />
        <Text style={styles.loadingText}>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Good morning, {firstName}!
      </Text>

      <Text style={styles.subtitle}>{today}</Text>
      <View style={styles.profileCard}>
  <Text style={styles.sectionTitle}>
    My Fitness Profile
  </Text>

  <Text>
    Current Weight: {profile?.current_weight ?? "Not set"} lb
  </Text>

  <Text>
    Goal Weight: {profile?.goal_weight ?? "Not set"} lb
  </Text>

  <Text>
    Fitness Goal: {profile?.fitness_goal ?? "Not set"}
  </Text>

  <Text>
    Workout Days: {profile?.workout_days?.join(", ") || "Not set"}
  </Text>

  <Text>
    Gym Access: {
      profile?.gym_access == null
        ? "Not set"
        : profile.gym_access
        ? "Yes"
        : "No"
    }
  </Text>
</View>

      {error !== "" && (
        <Text style={styles.error}>{error}</Text>
      )}

      <View style={styles.calorieCard}>
        <View style={styles.ring} />

        <View style={styles.calorieText}>
          <Text style={styles.calorieValue}>
            {fmt(data.consumed)}
          </Text>

          <Text style={styles.calorieSub}>
            of {fmt(data.goal)} kcal consumed
          </Text>

          <Text style={styles.calorieRemaining}>
            {fmt(remaining)} remaining
          </Text>
        </View>
      </View>

      <View style={styles.tileRow}>
        <MacroTile
          value={`${data.carbs}g`}
          label="Carbs"
        />

        <MacroTile
          value={`${data.fat}g`}
          label="Fat"
        />

        <MacroTile
          value={`${data.protein}g`}
          label="Protein"
        />
      </View>

      <View style={styles.mealsRow}>
        <Text style={styles.mealsLabel}>
          Meals eaten
        </Text>

        <Text style={styles.mealsValue}>
          {data.mealsEaten} of {data.mealsPlanned}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Today’s workout
      </Text>

      <View style={styles.workoutCard}>
        <Text style={styles.workoutName}>
          {w.name}
        </Text>

        <Text style={styles.workoutMeta}>
          {w.minutes} min • {w.exercises} exercises • {w.level}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
  backgroundColor: "#efefef",
  borderRadius: 12,
  padding: 16,
  marginTop: 20,
},
  screen: {
    flex: 1,
    backgroundColor: "#fafafa",
  },

  container: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b6b6b",
    marginTop: 4,
  },

  error: {
    color: "#b42318",
    marginTop: 12,
  },

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

  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 8,
    borderColor: "#111",
    marginRight: 16,
  },

  calorieText: {
    flex: 1,
  },

  calorieValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  calorieSub: {
    fontSize: 12,
    color: "#6b6b6b",
    marginTop: 2,
  },

  calorieRemaining: {
    fontSize: 12,
    color: "#111",
    marginTop: 4,
  },

  tileRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  tile: {
    flex: 1,
    backgroundColor: "#efefef",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  tileValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  tileLabel: {
    fontSize: 11,
    color: "#6b6b6b",
    marginTop: 2,
  },

  mealsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginTop: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d9d9",
  },

  mealsLabel: {
    fontSize: 14,
    color: "#6b6b6b",
  },

  mealsValue: {
    fontSize: 14,
    color: "#111",
  },

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

  workoutName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  workoutMeta: {
    fontSize: 12,
    color: "#6b6b6b",
    marginTop: 4,
  },
});
