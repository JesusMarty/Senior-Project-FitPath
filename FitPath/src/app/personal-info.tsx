import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";

export default function PersonalInfo() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  const [activityLevel, setActivityLevel] =
    useState("Moderately active");

  const [showActivities, setShowActivities] =
    useState(false);

  const activityLevels = [
    "Sedentary",
    "Lightly active",
    "Moderately active",
    "Very active",
  ];

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

        <Text style={styles.step}>Step 3 of 6</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Tell us about you
      </Text>

      <Text style={styles.subtitle}>
        We'll use this to personalize your targets.
      </Text>

      {/* Weight */}
      <Text style={styles.label}>Weight</Text>

      <TextInput
        style={styles.input}
        placeholder="165 lb"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      {/* Height */}
      <Text style={styles.label}>Height</Text>

      <TextInput
        style={styles.input}
        placeholder="5 ft 9 in"
        value={height}
        onChangeText={setHeight}
      />

      {/* Age */}
      <Text style={styles.label}>Age</Text>

      <TextInput
        style={styles.input}
        placeholder="28"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Activity Level */}
      <Text style={styles.label}>
        Activity level
      </Text>

      <Pressable
        style={styles.dropdown}
        onPress={() =>
          setShowActivities(!showActivities)
        }
      >
        <Text style={styles.dropdownText}>
          {activityLevel}
        </Text>

        <Text style={styles.arrow}>
          {showActivities ? "▲" : "▼"}
        </Text>
      </Pressable>

      {/* Dropdown options */}
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

      {/* Continue */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/goal-review")}
      >
        <Text style={styles.buttonText}>
          Continue
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

  button: {
    height: 50,
    backgroundColor: "#292929",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});