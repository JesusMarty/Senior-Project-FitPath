
import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import {router,useFocusEffect,useLocalSearchParams,} from "expo-router";
import { supabase } from "../lib/supabase";

const goalOptions = [
  {
    title: "Lose weight",
    description: "Build sustainable calorie and movement habits",
  },
  {
    title: "Gain muscle",
    description: "Increase strength and lean mass",
  },
  {
    title: "Bulk",
    description: "Support a focused calorie surplus",
  },
  {
    title: "Become more active",
    description: "Move more throughout your week",
  },
];

export default function FitnessGoal() {
  const { mode } = useLocalSearchParams<{
  mode?: string;
}>();

const isEditing = mode === "edit";
  const [goal, setGoal] = useState("Lose weight");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadGoal = async () => {
        setLoading(true);
        setMessage("");

        try {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (!active) return;

          if (authError) throw authError;

          if (!user) {
            router.replace("/login");
            return;
          }

          const { data, error } = await supabase
            .from("profiles")
            .select("fitness_goal")
            .eq("id", user.id)
            .maybeSingle();

          if (!active) return;

          if (error) throw error;

          if (data?.fitness_goal) {
            setGoal(data.fitness_goal);
          }
        } catch (error) {
          if (active) {
            console.error("Load fitness goal error:", error);
            setMessage("Unable to load your saved fitness goal.");
          }
        } finally {
          if (active) setLoading(false);
        }
      };

      loadGoal();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleContinue = async () => {
    if (saving || loading) return;

    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            fitness_goal: goal,
          },
          {
            onConflict: "id",
          }
        );

      if (error) throw error;

     if (isEditing) {
  router.replace("/(home_tabs)/account");
} else {
  router.push("/personal-info");
} 
    } catch (error) {
      console.error("Save fitness goal error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save your fitness goal."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <View style={styles.topRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.step}>Step 2 of 6</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
      </View>

      <Text style={styles.title}>
        What's your fitness goal?
      </Text>

      <Text style={styles.subtitle}>
        Choose the goal you want to focus on first.
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#292929"
        />
      ) : (
        <>
          {goalOptions.map((option) => (
            <Pressable
              key={option.title}
              style={[
                styles.option,
                goal === option.title && styles.selectedOption,
              ]}
              onPress={() => setGoal(option.title)}
            >
              <Text style={styles.optionTitle}>
                {goal === option.title ? "●" : "○"}{" "}
                {option.title}
              </Text>

              <Text style={styles.optionDescription}>
                {option.description}
              </Text>
            </Pressable>
          ))}

          {message !== "" && (
            <Text style={styles.message}>{message}</Text>
          )}

          <Pressable
            style={[
              styles.button,
              saving && styles.disabledButton,
            ]}
            disabled={saving}
            onPress={handleContinue}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
  {isEditing ? "Save Changes" : "Continue"}
</Text>
            )}
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flexGrow: 1,
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

  progressInactive: {
    flex: 1,
    height: 3,
    backgroundColor: "#ddd",
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

  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
  },

  selectedOption: {
    borderWidth: 2,
    borderColor: "#292929",
    backgroundColor: "#f5f5f5",
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  optionDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
    marginLeft: 22,
  },

  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  message: {
    fontSize: 14,
    color: "#b42318",
    marginBottom: 12,
  },
});
