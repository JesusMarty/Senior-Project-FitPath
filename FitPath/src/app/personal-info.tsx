
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

const activityLevels = [
  "Sedentary",
  "Lightly active",
  "Moderately active",
  "Very active",
];

export default function PersonalInfo() {
    const { mode } = useLocalSearchParams<{
    mode?: string;
  }>();

  const isEditing = mode === "edit";

  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  const [activityLevel, setActivityLevel] =
    useState("Moderately active");

  const [showActivities, setShowActivities] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          if (active) router.replace("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select(
  "current_weight, goal_weight, height, age, activity_level"
)
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (!active || !data) return;

        setWeight(
          data.current_weight == null
            ? ""
            : String(data.current_weight)
        );
        setGoalWeight(
  data.goal_weight == null
    ? ""
    : String(data.goal_weight)
);

        setHeight(data.height ?? "");

        setAge(
          data.age == null ? "" : String(data.age)
        );

        if (
          activityLevels.includes(data.activity_level)
        ) {
          setActivityLevel(data.activity_level);
        }
      } catch (error) {
        console.error("Load profile error:", error);
        if (active) {
          setMessage("Unable to load saved information.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleContinue = async () => {
    if (saving) return;

    Keyboard.dismiss();
    setMessage("");

    const parsedWeight = Number(weight.trim());
    const parsedAge = Number(age.trim());
    const parsedGoalWeight = goalWeight.trim()
  ? Number(goalWeight.trim())
  : null;

if (
  parsedGoalWeight !== null &&
  (!Number.isFinite(parsedGoalWeight) ||
    parsedGoalWeight <= 0 ||
    parsedGoalWeight > 9999.99)
) {
  setMessage("Enter a valid goal weight in pounds.");
  return;
}

    if (
      !weight.trim() ||
      !height.trim() ||
      !age.trim()
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0 ||
      parsedWeight > 9999.99
    ) {
      setMessage("Enter a valid weight in pounds.");
      return;
    }

    if (
      !Number.isInteger(parsedAge) ||
      parsedAge < 13 ||
      parsedAge > 120
    ) {
      setMessage("Enter a valid age (13–120).");
      return;
    }

    const heightMatch = height
      .trim()
      .match(/^(\d+)\s*(?:ft|feet|')\s*(\d+)\s*(?:in|inches|")?$/i);

    if (!heightMatch) {
      setMessage("Enter height like 5 ft 4 in.");
      return;
    }

    const feet = Number(heightMatch[1]);
    const inches = Number(heightMatch[2]);

    if (
      feet < 3 ||
      feet > 8 ||
      inches < 0 ||
      inches > 11
    ) {
      setMessage("Enter a valid height.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setMessage("Please sign in again.");
        router.replace("/login");
        return;
      }

      const fullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null;

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: fullName,
            current_weight: parsedWeight,
            goal_weight: parsedGoalWeight,
            height: `${feet} ft ${inches} in`,
            age: parsedAge,
            activity_level: activityLevel,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) throw error;

     if (isEditing) {
  router.replace("/(home_tabs)/account");
} else {
  router.push("/goal-review");
}
    } catch (error: any) {
      console.error("Save profile error:", error);
      setMessage(
        error?.message ??
          "Unable to save your information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#292929" />
        <Text style={styles.loadingText}>
          Loading your information...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.topRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </Pressable>

          <Text style={styles.step}>
            Step 3 of 6
          </Text>
        </View>

        <View style={styles.progressContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <View
              key={index}
              style={
                index < 3
                  ? styles.progressActive
                  : styles.progressInactive
              }
            />
          ))}
        </View>

        <Text style={styles.title}>
          Tell us about you
        </Text>

        <Text style={styles.subtitle}>
          We'll use this to personalize your targets.
        </Text>

        <Text style={styles.label}>
          Weight (lb)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="165"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
        <Text style={styles.label}>
  Goal Weight (lb)
</Text>

<TextInput
  style={styles.input}
  placeholder="Enter your target weight"
  value={goalWeight}
  onChangeText={setGoalWeight}
  keyboardType="decimal-pad"
  returnKeyType="done"
/>

        <Text style={styles.label}>
          Height
        </Text>

        <TextInput
          style={styles.input}
          placeholder="5 ft 9 in"
          value={height}
          onChangeText={setHeight}
          returnKeyType="next"
        />

        <Text style={styles.label}>
          Age
        </Text>

        <TextInput
          style={styles.input}
          placeholder="28"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          returnKeyType="done"
        />

        <Text style={styles.label}>
          Activity level
        </Text>

        <Pressable
          style={styles.dropdown}
          onPress={() => {
            Keyboard.dismiss();
            setShowActivities(!showActivities);
          }}
        >
          <Text style={styles.dropdownText}>
            {activityLevel}
          </Text>

          <Text style={styles.arrow}>
            {showActivities ? "▲" : "▼"}
          </Text>
        </Pressable>

        {showActivities && (
          <View style={styles.dropdownMenu}>
            {activityLevels.map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.dropdownOption,
                  activityLevel === level &&
                    styles.selectedDropdownOption,
                ]}
                onPress={() => {
                  setActivityLevel(level);
                  setShowActivities(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>
                  {activityLevel === level ? "✓  " : ""}
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {message !== "" && (
          <Text style={styles.message}>
            {message}
          </Text>
        )}

        <Pressable
          disabled={saving}
          style={[
            styles.button,
            saving && styles.disabledButton,
          ]}
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
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
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
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 12,
    color: "#555",
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 18,
    overflow: "hidden",
  },
  dropdownOption: {
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  selectedDropdownOption: {
    backgroundColor: "#f2f2f2",
  },
  dropdownOptionText: {
    fontSize: 15,
  },
  message: {
    color: "#b42318",
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
