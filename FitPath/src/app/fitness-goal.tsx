import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";


export default function FitnessGoal() {
  const [goal, setGoal] = useState("Lose weight");

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

        <Text style={styles.step}>Step 2 of 6</Text>
      </View>

      {/* Progress bar */}
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

      {/* Lose weight */}
      <Pressable
        style={[
          styles.option,
          goal === "Lose weight" && styles.selectedOption,
        ]}
        onPress={() => setGoal("Lose weight")}
      >
        <Text style={styles.optionTitle}>
          {goal === "Lose weight" ? "●" : "○"} Lose weight
        </Text>

        <Text style={styles.optionDescription}>
          Build sustainable calorie and movement habits
        </Text>
      </Pressable>

      {/* Gain muscle */}
      <Pressable
        style={[
          styles.option,
          goal === "Gain muscle" && styles.selectedOption,
        ]}
        onPress={() => setGoal("Gain muscle")}
      >
        <Text style={styles.optionTitle}>
          {goal === "Gain muscle" ? "●" : "○"} Gain muscle
        </Text>

        <Text style={styles.optionDescription}>
          Increase strength and lean mass
        </Text>
      </Pressable>

      {/* Bulk */}
      <Pressable
        style={[
          styles.option,
          goal === "Bulk" && styles.selectedOption,
        ]}
        onPress={() => setGoal("Bulk")}
      >
        <Text style={styles.optionTitle}>
          {goal === "Bulk" ? "●" : "○"} Bulk
        </Text>

        <Text style={styles.optionDescription}>
          Support a focused calorie surplus
        </Text>
      </Pressable>

      {/* Become more active */}
      <Pressable
        style={[
          styles.option,
          goal === "Become more active" && styles.selectedOption,
        ]}
        onPress={() => setGoal("Become more active")}
      >
        <Text style={styles.optionTitle}>
          {goal === "Become more active" ? "●" : "○"} Become more active
        </Text>

        <Text style={styles.optionDescription}>
          Move more throughout your week
        </Text>
      </Pressable>

      {/* Continue */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/personal-info")}
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
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

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});