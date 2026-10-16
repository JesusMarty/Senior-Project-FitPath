import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

export default function GoalReview() {
  return (
    <View style={styles.container}>

      <View style={styles.topRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.step}>Step 4 of 6</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
      </View>

      <Text style={styles.title}>Review your goal</Text>

      <Text style={styles.subtitle}>
        Make sure this still feels right.
      </Text>

      <View style={styles.card}>

        <View style={styles.targetIcon}>
          <View style={styles.targetMiddle}>
            <View style={styles.targetCenter} />
          </View>
        </View>

        <Text style={styles.goalTitle}>
          Lose weight
        </Text>

        <Text style={styles.description}>
          A balanced plan focused on steady progress
          and habits you can maintain.
        </Text>

        <Text style={styles.changeGoal}>
          Change goal
        </Text>

      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/exercise-setup")}
      >
        <Text style={styles.buttonText}>
          Looks good
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

  card: {
    borderWidth: 2,
    borderColor: "#292929",
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
  },

  targetIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  targetMiddle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  targetCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#292929",
  },

  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 21,
    marginBottom: 18,
  },

  changeGoal: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
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