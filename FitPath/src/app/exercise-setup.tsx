import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ExerciseSetup() {
  const { mode } = useLocalSearchParams<{
  mode?: string;
}>();

const isEditing = mode === "edit";
  const [experience, setExperience] = useState("Beginner");
  const [gymAccess, setGymAccess] = useState("Yes");
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");

useEffect(() => {
  let active = true;

  const loadGymAccess = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) {
        router.replace("/login");
        const handleSave = async () => {
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
          gym_access: gymAccess === "Yes",
        },
        { onConflict: "id" }
      );

    if (error) throw error;

    if (isEditing) {
  router.replace("/(home_tabs)/account");
} else {
  router.push("/recommended-plan");
}
  } catch (error: any) {
    console.error("Save gym access error:", error);
    setMessage(
      error?.message ?? "Unable to save gym access."
    );
  } finally {
    setSaving(false);
  }
};
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("gym_access")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (active && data?.gym_access != null) {
        setGymAccess(data.gym_access ? "Yes" : "No");
      }
    } catch (error) {
      console.error("Load gym access error:", error);
      if (active) {
        setMessage("Unable to load gym access.");
      }
    } finally {
      if (active) setLoading(false);
    }
  };

  loadGymAccess();

  return () => {
    active = false;
  };
}, []);

const handleSave = async () => {
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
      .update({
        gym_access: gymAccess === "Yes",
      })
      .eq("id", user.id);

    if (error) throw error;

    router.push("/recommended-plan");
  } catch (error: any) {
    console.error("Save gym access error:", error);
    setMessage(
      error?.message ?? "Unable to save gym access."
    );
  } finally {
    setSaving(false);
  }
};
  return (
    <View style={styles.container}>

      {/* Top section */}
      <View style={styles.topRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.step}>Step 5 of 6</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Set up your exercise plan
      </Text>

      <Text style={styles.subtitle}>
        Choose your current experience and available equipment.
      </Text>

      {/* Experience Level */}
      <Text style={styles.label}>
        Experience level
      </Text>

      <View style={styles.experienceRow}>

        <Pressable
          style={[
            styles.experienceOption,
            experience === "Beginner" &&
              styles.selectedExperience,
          ]}
          onPress={() => setExperience("Beginner")}
        >
          <Text
            style={[
              styles.experienceText,
              experience === "Beginner" &&
                styles.selectedExperienceText,
            ]}
          >
            Beginner
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.experienceOption,
            experience === "Intermediate" &&
              styles.selectedExperience,
          ]}
          onPress={() => setExperience("Intermediate")}
        >
          <Text
            style={[
              styles.experienceText,
              experience === "Intermediate" &&
                styles.selectedExperienceText,
            ]}
          >
            Intermediate
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.experienceOption,
            experience === "Advanced" &&
              styles.selectedExperience,
          ]}
          onPress={() => setExperience("Advanced")}
        >
          <Text
            style={[
              styles.experienceText,
              experience === "Advanced" &&
                styles.selectedExperienceText,
            ]}
          >
            Advanced
          </Text>
        </Pressable>

      </View>

      {/* Gym Access */}
      <Text style={styles.label}>
        Do you have access to a gym?
      </Text>

      <View style={styles.gymRow}>

        {/* Yes */}
        <Pressable
          style={[
            styles.gymOption,
            gymAccess === "Yes" &&
              styles.selectedGym,
          ]}
          onPress={() => setGymAccess("Yes")}
        >
          <Text style={styles.gymText}>
            {gymAccess === "Yes" ? "●" : "○"} Yes
          </Text>
        </Pressable>

        {/* No */}
        <Pressable
          style={[
            styles.gymOption,
            gymAccess === "No" &&
              styles.selectedGym,
          ]}
          onPress={() => setGymAccess("No")}
        >
          <Text style={styles.gymText}>
            {gymAccess === "No" ? "●" : "○"} No
          </Text>
        </Pressable>

      </View>

      {/* Continue */}
      <Pressable
  style={styles.button}
  onPress={handleSave}
  disabled={saving || loading}
>
  <Text style={styles.buttonText}>
    {saving
  ? "Saving..."
  : isEditing
  ? "Save Changes"
  : "Build my plan"}
  </Text>
</Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
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
    lineHeight: 22,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  experienceRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },

  experienceOption: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedExperience: {
    backgroundColor: "#292929",
    borderColor: "#292929",
  },

  experienceText: {
    fontSize: 12,
    color: "#292929",
  },

  selectedExperienceText: {
    color: "#fff",
    fontWeight: "600",
  },

  gymRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  gymOption: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  selectedGym: {
    borderWidth: 2,
    borderColor: "#292929",
    backgroundColor: "#f5f5f5",
  },

  gymText: {
    fontSize: 14,
  },

  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});